import { Component, EventEmitter, Input, Output, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import mapboxgl from 'mapbox-gl';

@Component({
    selector: 'app-eucaliptos-plano',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './eucaliptos-plano.component.html',
    styleUrls: ['./eucaliptos-plano.component.css']
})
export class EucaliptosPlanoComponent implements OnInit, AfterViewInit {
    @Output() close = new EventEmitter<void>();
    @ViewChild('mapContainer') mapContainer!: ElementRef;

    map: mapboxgl.Map | undefined;
    showHelpAlert = signal(true);
    selectedLot = signal<string | null>(null);
    style = 'mapbox://styles/mapbox/streets-v11';
    // Coordinates might need adjustment for Eucaliptos, but starting with Circunvalacion's or a default. 
    // The JSON bounds will handle the view, so initial center is less critical if fitBounds works.
    lat = -12.1152; // Approximate from json data
    lng = -75.1726; // Approximate from json data
    zoom = 16;
    initialBounds: mapboxgl.LngLatBounds | undefined;

    // Placeholder for user token - same as Circunvalacion
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
            pitch: 45, // Less tilted view
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
        fetch('plano/eucaliptos.json')
            .then(response => response.json())
            .then(data => {
                if (!this.map) return;

                this.map.addSource('eucaliptos', {
                    type: 'geojson',
                    data: data,
                    promoteId: 'id'
                });

                // Layer for the general "lotes" area
                this.map.addLayer({
                    id: 'lotes-fill',
                    type: 'fill',
                    source: 'eucaliptos',
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
                    source: 'eucaliptos',
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
                    id: 'eucaliptos-line',
                    type: 'line',
                    source: 'eucaliptos',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#000000', // Black lines
                        'line-width': 1
                    }
                });

                // Street Labels (Black text Following the line, no line behind)
                this.map.addLayer({
                    id: 'street-labels',
                    type: 'symbol',
                    source: 'eucaliptos',
                    filter: ['has', 'calle'],
                    layout: {
                        // Capitalize first letter using Mapbox expressions
                        'text-field': [
                            'concat',
                            ['upcase', ['slice', ['get', 'calle'], 0, 1]],
                            ['slice', ['get', 'calle'], 1]
                        ],
                        'text-size': 17, // Slightly smaller than before (20px)
                        'symbol-placement': 'point', // Set to point as requested for better control
                        'text-rotate': -4, // Very subtle tilt as requested
                        'text-anchor': 'center',
                        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
                        'text-allow-overlap': true,
                        'text-ignore-placement': true
                    },
                    paint: {
                        'text-color': '#000000',
                        'text-halo-color': '#ffffff',
                        'text-halo-width': 2
                    }
                });

                // Lot Labels (Pure white normal text)
                this.map.addLayer({
                    id: 'lot-labels',
                    type: 'symbol',
                    source: 'eucaliptos',
                    filter: ['has', 'nombre'],
                    layout: {
                        'text-field': ['get', 'nombre'],
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
                    if (feature.geometry.type === 'LineString') { // Assuming LineString based on previous json
                        feature.geometry.coordinates.forEach((coord: any) => {
                            bounds.extend(coord);
                        });
                    } else if (feature.geometry.type === 'Polygon') {
                        feature.geometry.coordinates[0].forEach((coord: any) => {
                            bounds.extend(coord);
                        });
                    }
                });

                this.initialBounds = bounds;
                this.map.fitBounds(bounds, {
                    padding: 50,
                    pitch: 25,
                    bearing: -20
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
                                    { source: 'eucaliptos', id: selectedStateId },
                                    { selected: false }
                                );
                            }

                            selectedStateId = featureId!;
                            this.map!.setFeatureState(
                                { source: 'eucaliptos', id: featureId! },
                                { selected: true }
                            );

                            this.selectedLot.set(id);
                        }
                    } else {
                        if (selectedStateId !== null) {
                            this.map!.setFeatureState(
                                { source: 'eucaliptos', id: selectedStateId },
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
                        this.map!.getCanvas().style.cursor = 'pointer';
                        const featureId = e.features[0].id;

                        if (featureId !== undefined && hoveredStateId !== featureId) {
                            if (hoveredStateId !== null) {
                                this.map!.setFeatureState(
                                    { source: 'eucaliptos', id: hoveredStateId },
                                    { hover: false }
                                );
                            }
                            hoveredStateId = featureId;
                            this.map!.setFeatureState(
                                { source: 'eucaliptos', id: featureId },
                                { hover: true }
                            );
                        }
                    }
                });

                this.map.on('mouseleave', 'individual-lotes-fill', () => {
                    this.map!.getCanvas().style.cursor = '';
                    if (hoveredStateId !== null) {
                        this.map!.setFeatureState(
                            { source: 'eucaliptos', id: hoveredStateId },
                            { hover: false }
                        );
                    }
                    hoveredStateId = null;
                });

            })
            .catch(error => console.error('Error loading geojson:', error));
    }

    // Lot Details Data with specific typology and perimeters
    lotDetails: { [key: string]: { area: string, tipologia: string, izq: string, der: string, frente: string, fondo: string } } = {
        'A-1': { tipologia: 'Frente a la calle los eucaliptos', area: '100.00 m²', izq: '14.19', der: '14.18', frente: '6.82', fondo: '7.28' },
        'B-1': { tipologia: 'Frente a la calle los eucaliptos', area: '100.00 m²', izq: '14.18', der: '14.18', frente: '7.05', fondo: '7.05' },
        'C-1': { tipologia: 'Costado del pasaje Solidaridad', area: '93.00 m²', izq: '6.45', der: '6.4', frente: '14.33', fondo: '14.54' },
        'D-1': { tipologia: 'Costado del pasaje Solidaridad', area: '93.00 m²', izq: '6.36', der: '6.35', frente: '14.54', fondo: '14.74' },
        'E-1': { tipologia: 'Costado del pasaje Solidaridad', area: '91.00 m²', izq: '5.70', der: '6.57', frente: '14.74', fondo: '14.95' },
        'F-1': { tipologia: 'Frente a la calle los eucaliptos', area: '100.00 m²', izq: '14.54', der: '14.57', frente: '6.87', fondo: '6.87' },
        'G-1': { tipologia: 'Frente a la calle los eucaliptos', area: '100.00 m²', izq: '14.57', der: '14.60', frente: '6.89', fondo: '6.83' },
        'H-1': { tipologia: 'Costado del pasaje Solidaridad', area: '90.00 m²', izq: '6.58', der: '6.58', frente: '13.69', fondo: '13.66' },
        'I-1': { tipologia: 'Costado del pasaje Solidaridad', area: '90.00 m²', izq: '6.25', der: '6.59', frente: '13.63', fondo: '13.62' },
        'J-1': { tipologia: 'Costado del pasaje Solidaridad', area: '90.16 m²', izq: '6.25', der: '6.99', frente: '13.63', fondo: '13.62' }
    };

    getSelectionDetails() {
        const id = this.selectedLot();
        if (!id) return null;

        const details = this.lotDetails[id] || {
            tipologia: 'Consultar',
            area: '90.00 m²',
            izq: '?', der: '?', frente: '?', fondo: '?'
        };

        const parts = id.split('-');
        const mz = parts.length > 1 ? parts[0] : 'B';
        const lt = parts.length > 1 ? parts[1] : id;

        return {
            title: 'URB. LOS EUCALIPTOS',
            mz: mz,
            lt: lt,
            tipologia: details.tipologia,
            area: details.area,
            izq: details.izq,
            der: details.der,
            frente: details.frente,
            fondo: details.fondo
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
