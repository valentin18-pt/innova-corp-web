import { Component, signal, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CircunvalacionPlanoComponent } from '../plano/circunvalacion/circunvalacion-plano.component';

@Component({
    selector: 'app-circunvalacion',
    standalone: true,
    imports: [CommonModule, RouterLink, CircunvalacionPlanoComponent],
    templateUrl: './circunvalacion.component.html',
    styleUrl: './circunvalacion.component.css'
})
export class CircunvalacionComponent {
    mostrarInputPrefijo = signal(false);
    showPlano = signal(false);
    showCroquis = signal(false);
    activeSection = signal('info');

    // Gallery Logic
    galleryImages = [
        'images/proyectos/circunvalacion/galeria1.webp',
        'images/proyectos/circunvalacion/galeria2.webp',
        'images/proyectos/circunvalacion/galeria3.webp',
        'images/proyectos/circunvalacion/galeria4.webp',
        'images/proyectos/circunvalacion/galeria5.webp'
    ];
    currentGalleryIndex = 0;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    onPrefijoChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this.mostrarInputPrefijo.set(select.value === 'otro');
    }

    toggleModal(state: boolean) {
        this.showCroquis.set(state);
        if (state) {
            this.document.body.style.overflow = 'hidden';
        } else {
            this.document.body.style.overflow = '';
        }
    }

    togglePlano(state: boolean) {
        this.showPlano.set(state);
        if (state) {
            this.document.body.style.overflow = 'hidden';
        } else {
            this.document.body.style.overflow = '';
        }
    }

    openGoogleMaps() {
        window.open('https://www.google.com/maps/dir/?api=1&destination=-12.118431,-75.171836', '_blank');
    }

    nextImage() {
        if (this.currentGalleryIndex < this.galleryImages.length - 1) {
            this.currentGalleryIndex++;
        } else {
            this.currentGalleryIndex = 0;
        }
    }

    prevImage() {
        if (this.currentGalleryIndex > 0) {
            this.currentGalleryIndex--;
        } else {
            this.currentGalleryIndex = this.galleryImages.length - 1;
        }
    }

    scrollTo(sectionId: string) {
        const element = this.document.getElementById(sectionId);
        if (element) {
            const headerOffset = 140; // Space for fixed header + sub-nav
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (isPlatformBrowser(this.platformId)) {
            const sections = ['info', 'plano', 'ubicacion', 'beneficios', 'galeria', 'financiamiento'];
            const scrollPosition = window.pageYOffset + 150; // Offset for better detection

            for (const section of sections) {
                const element = this.document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const height = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
                        this.activeSection.set(section);
                    }
                }
            }
        }
    }
}
