import { Component, signal, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-eucaliptos',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './eucaliptos.component.html',
    styleUrl: './eucaliptos.component.css'
})
export class EucaliptosComponent {
    mostrarInputPrefijo = signal(false);
    activeSection = signal('info');

    // Gallery Logic (Using same as circunvalacion for now as requested)
    galleryImages = [
        'images/proyectos/eucaliptos/galeria1.webp',
        'images/proyectos/eucaliptos/galeria2.webp',
        'images/proyectos/eucaliptos/galeria3.webp',
        'images/proyectos/eucaliptos/galeria4.webp',
        'images/proyectos/eucaliptos/galeria5.webp'
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
