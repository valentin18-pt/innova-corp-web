import { Component, EventEmitter, Input, Output, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import mapboxgl from 'mapbox-gl';

@Component({
    selector: 'app-circunvalacion-plano',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './circunvalacion-plano.component.html',
    styleUrls: ['./circunvalacion-plano.component.css']
})
export class CircunvalacionPlanoComponent implements OnInit, AfterViewInit {
    @Output() close = new EventEmitter<void>();
    @ViewChild('mapContainer') mapContainer!: ElementRef;

    map: mapboxgl.Map | undefined;
    showHelpAlert = signal(true);
    selectedLot = signal<string | null>(null);
    style = 'mapbox://styles/mapbox/streets-v11';
    lat = -12.1185;
    lng = -75.1720;
    zoom = 16;
    initialBounds: mapboxgl.LngLatBounds | undefined;

    // Placeholder for user token
    token = 'pk.eyJ1Ijoiam9zZTE4IiwiYSI6ImNtajM1YTM5NDEyZzkzZW9qaGFyYnI3MHMifQ.djnCr9S-LyEMTgYePUyGPw';

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() {
        (mapboxgl as any).accessToken = this.token;
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.initializeMap();
        }
    }

    initializeMap() {
        if (!this.mapContainer) return;

        this.map = new mapboxgl.Map({
            container: this.mapContainer.nativeElement,
            style: this.style,
            center: [this.lng, this.lat],
            zoom: 18,
            pitch: 60, // Less tilted view
            bearing: -20, // Slight rotation
            attributionControl: false
        });

        this.map.on('load', () => {
            this.loadGeoJson();
        });
    }

    loadGeoJson() {
        if (!this.map) return;

        // Loading the local json file
        fetch('plano/circunvalacion.json')
            .then(response => response.json())
            .then(data => {
                if (!this.map) return;

                this.map.addSource('circunvalacion', {
                    type: 'geojson',
                    data: data,
                    promoteId: 'id' // Crucial for feature-state to work with properties.id
                });

                // Layer for the general "lotes" area (background if needed, but individual lots will cover it)
                this.map.addLayer({
                    id: 'lotes-fill',
                    type: 'fill',
                    source: 'circunvalacion',
                    filter: ['==', 'id', 'lotes'],
                    paint: {
                        'fill-color': '#d2b48c',
                        'fill-opacity': 0.3
                    }
                });

                // Layer for individual lots (clickable + hover effect)
                this.map.addLayer({
                    id: 'individual-lotes-fill',
                    type: 'fill',
                    source: 'circunvalacion',
                    filter: ['!=', 'id', 'lotes'],
                    paint: {
                        'fill-color': [
                            'case',
                            ['boolean', ['feature-state', 'selected'], false],
                            '#a9a9a9', // Grey (Plomo) on selected
                            ['boolean', ['feature-state', 'hover'], false],
                            '#d1d5db', // Light grey on hover
                            '#d2b48c'  // Tierra (Earth) default
                        ],
                        'fill-opacity': 0.9
                    }
                });

                // Lines for all lots (Black)
                this.map.addLayer({
                    id: 'circunvalacion-line',
                    type: 'line',
                    source: 'circunvalacion',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#000000', // Black lines
                        'line-width': 1
                    }
                });

                // Lot Labels (Pure white normal text)
                this.map.addLayer({
                    id: 'lot-labels',
                    type: 'symbol',
                    source: 'circunvalacion',
                    filter: ['!=', 'id', 'lotes'],
                    layout: {
                        'text-field': ['coalesce', ['get', 'nombre'], ['get', 'id']],
                        'text-size': 14,
                        'text-anchor': 'center',
                        'text-allow-overlap': true,
                        'text-ignore-placement': true,
                        'symbol-placement': 'point',
                        'text-pitch-alignment': 'viewport',
                        'text-rotation-alignment': 'viewport',
                        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular']
                    },
                    paint: {
                        'text-color': '#ffffff'
                    }
                });

                // Fit bounds
                const bounds = new mapboxgl.LngLatBounds();
                data.features.forEach((feature: any) => {
                    if (feature.geometry.type === 'LineString') {
                        feature.geometry.coordinates.forEach((coord: any) => {
                            bounds.extend(coord);
                        });
                    }
                });

                this.initialBounds = bounds;
                this.map.fitBounds(bounds, {
                    padding: 50,
                    pitch: 25, // Adjusted to be less tilted
                    bearing: -20 // Ensure bearing is maintained
                });

                // Click event for lots
                // Selection Logic
                let selectedStateId: string | number | null = null;

                this.map.on('click', 'individual-lotes-fill', (e) => {
                    const features = this.map!.queryRenderedFeatures(e.point, { layers: ['individual-lotes-fill'] });

                    if (features.length > 0) {
                        const feature = features[0];
                        const id = feature.properties?.['id'];
                        const featureId = feature.id;

                        if (id) {
                            if (selectedStateId !== null) {
                                this.map!.setFeatureState(
                                    { source: 'circunvalacion', id: selectedStateId },
                                    { selected: false }
                                );
                            }

                            selectedStateId = featureId!;
                            this.map!.setFeatureState(
                                { source: 'circunvalacion', id: featureId! },
                                { selected: true }
                            );

                            this.selectedLot.set(id);
                        }
                    } else {
                        if (selectedStateId !== null) {
                            this.map!.setFeatureState(
                                { source: 'circunvalacion', id: selectedStateId },
                                { selected: false }
                            );
                            selectedStateId = null;
                            this.selectedLot.set(null);
                        }
                    }
                });

                // Hover State Logic
                let hoveredStateId: string | number | null = null;

                this.map.on('mousemove', 'individual-lotes-fill', (e) => {
                    if (e.features && e.features.length > 0) {
                        // Change cursor
                        this.map!.getCanvas().style.cursor = 'pointer';

                        const featureId = e.features[0].id; // uses promoteId we set earlier (which maps to properties.id)

                        // If we are over a new feature
                        if (featureId !== undefined && hoveredStateId !== featureId) {
                            // Reset previous feature state
                            if (hoveredStateId !== null) {
                                this.map!.setFeatureState(
                                    { source: 'circunvalacion', id: hoveredStateId },
                                    { hover: false }
                                );
                            }

                            // Set new feature state
                            hoveredStateId = featureId;
                            this.map!.setFeatureState(
                                { source: 'circunvalacion', id: featureId },
                                { hover: true }
                            );
                        }
                    }
                });

                this.map.on('mouseleave', 'individual-lotes-fill', () => {
                    this.map!.getCanvas().style.cursor = '';
                    if (hoveredStateId !== null) {
                        this.map!.setFeatureState(
                            { source: 'circunvalacion', id: hoveredStateId },
                            { hover: false }
                        );
                    }
                    hoveredStateId = null;
                });

            })
            .catch(error => console.error('Error loading geojson:', error));
    }

    // Lot Details Data with price
    lotDetails: { [key: string]: { area: string, perimeter: string, price: string } } = {
        // Manzana A
        'A-1': { area: '90.00 m²', perimeter: '45.12 m', price: 'S/ 45,000' },
        'A-2': { area: '100.00 m²', perimeter: '45.63 m', price: 'S/ 50,000' },
        'A-3': { area: '94.00 m²', perimeter: '39.07 m', price: 'S/ 47,000' },
        'A-4': { area: '90.00 m²', perimeter: '38.94 m', price: 'S/ 45,000' },
        'A-5': { area: '90.00 m²', perimeter: '38.21 m', price: 'S/ 45,000' },
        'A-6': { area: '90.00 m²', perimeter: '38.16 m', price: 'S/ 45,000' },
        'A-7': { area: '90.00 m²', perimeter: '38.13 m', price: 'S/ 45,000' },
        'A-8': { area: '90.72 m²', perimeter: '39.20 m', price: 'S/ 45,360' },

        // Manzana B
        'B-1': { area: '100.00 m²', perimeter: '45.93 m', price: 'S/ 50,000' },
        'B-2': { area: '100.00 m²', perimeter: '45.61 m', price: 'S/ 50,000' },
        'B-3': { area: '100.00 m²', perimeter: '45.21 m', price: 'S/ 50,000' },
        'B-4': { area: '92.00 m²', perimeter: '38.53 m', price: 'S/ 46,000' },
        'B-5': { area: '92.00 m²', perimeter: '38.49 m', price: 'S/ 46,000' },
        'B-6': { area: '92.00 m²', perimeter: '38.51 m', price: 'S/ 46,000' },
        'B-7': { area: '92.00 m²', perimeter: '38.46 m', price: 'S/ 46,000' },
        'B-8': { area: '92.00 m²', perimeter: '38.49 m', price: 'S/ 46,000' },
        'B-9': { area: '92.00 m²', perimeter: '38.45 m', price: 'S/ 46,000' },
        'B-10': { area: '91.00 m²', perimeter: '38.25 m', price: 'S/ 45,500' },
        'B-11': { area: '90.00 m²', perimeter: '38.00 m', price: 'S/ 45,000' },
        'B-12': { area: '90.00 m²', perimeter: '38.04 m', price: 'S/ 45,000' },
        'B-13': { area: '90.00 m²', perimeter: '38.00 m', price: 'S/ 45,000' },
        'B-14': { area: '90.00 m²', perimeter: '38.03 m', price: 'S/ 45,000' },
        'B-15': { area: '90.00 m²', perimeter: '38.00 m', price: 'S/ 45,000' },
        'B-16': { area: '90.06 m²', perimeter: '37.95 m', price: 'S/ 45,030' },
        'B-17': { area: '90.00 m²', perimeter: '38.01 m', price: 'S/ 45,000' },

        // Manzana C
        'C-1': { area: '90.00 m²', perimeter: '43.83 m', price: 'S/ 45,000' },
        'C-2': { area: '100.00 m²', perimeter: '45.36 m', price: 'S/ 50,000' },
        'C-3': { area: '100.00 m²', perimeter: '40.44 m', price: 'S/ 50,000' },
        'C-4': { area: '100.00 m²', perimeter: '40.40 m', price: 'S/ 50,000' },
        'C-5': { area: '100.00 m²', perimeter: '40.40 m', price: 'S/ 50,000' },
        'C-6': { area: '100.00 m²', perimeter: '40.40 m', price: 'S/ 50,000' },
        'C-7': { area: '100.00 m²', perimeter: '40.40 m', price: 'S/ 50,000' },
        'C-8': { area: '90.00 m²', perimeter: '38.66 m', price: 'S/ 45,000' },
        'C-9': { area: '90.00 m²', perimeter: '38.66 m', price: 'S/ 45,000' },
        'C-10': { area: '90.00 m²', perimeter: '38.66 m', price: 'S/ 45,000' },
        'C-11': { area: '91.05 m²', perimeter: '38.84 m', price: 'S/ 45,525' }
    };

    getSelectionDetails() {
        const id = this.selectedLot();
        if (!id || !this.lotDetails[id]) return null;

        const details = this.lotDetails[id];
        const parts = id.split('-');
        const mz = parts[0];
        const lt = parts[1];

        return {
            title: 'URB. VILLA CIRCUNVALACION',
            mz: mz,
            lt: lt,
            area: details.area,
            price: details.price,
            perimeter: details.perimeter
        };
    }

    onClose() {
        this.close.emit();
    }

    // Navigation Methods
    resetView() {
        if (this.map && this.initialBounds) {
            this.map.fitBounds(this.initialBounds, {
                padding: 50,
                pitch: 45,
                bearing: -20,
                duration: 1000
            });
        }
    }

    pan(direction: 'up' | 'down' | 'left' | 'right') {
        if (!this.map) return;
        const offset = 100;
        switch (direction) {
            case 'up': this.map.panBy([0, -offset]); break;
            case 'down': this.map.panBy([0, offset]); break;
            case 'left': this.map.panBy([-offset, 0]); break;
            case 'right': this.map.panBy([offset, 0]); break;
        }
    }

    zoomMap(delta: 'in' | 'out') {
        if (!this.map) return;
        if (delta === 'in') {
            this.map.zoomIn();
        } else {
            this.map.zoomOut();
        }
    }
}
