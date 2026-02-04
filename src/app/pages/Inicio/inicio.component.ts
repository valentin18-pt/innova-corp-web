import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {
  mostrarInputPrefijo = signal(false);

  portadas = [
    'images/inicio/portada1.webp',
    'images/inicio/portada2.webp',
    'images/inicio/portada3.webp',
    'images/inicio/portada4.webp',
    'images/inicio/portada5.webp'
  ];
  currentPortadaIndex = signal(0);
  private intervalId: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.nextPortada();
    }, 6000);
  }

  nextPortada() {
    this.currentPortadaIndex.update(idx => (idx + 1) % this.portadas.length);
  }

  onPrefijoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.mostrarInputPrefijo.set(select.value === 'otro');
  }

  clientes = [
    {
      img: 'images/clientes/cliente1.webp',
      titulo: 'Una excelente decisión',
      texto: 'Compré mi lote con total confianza. El proceso fue claro, rápido y siempre me brindaron asesoría.'
    },
    {
      img: 'images/clientes/cliente2.webp',
      titulo: 'Recomendado al 100%',
      texto: 'El equipo fue amable y resolvió todas mis dudas. Sin duda los recomiendo.'
    },
    {
      img: 'images/clientes/cliente3.webp',
      titulo: 'Una inversión segura',
      texto: 'Elegí esta inmobiliaria por su seriedad. Hoy ya estoy proyectando mi futura vivienda.'
    },
    {
      img: 'images/clientes/cliente4.webp',
      titulo: 'Experiencia increíble',
      texto: 'Desde la primera visita supe que era el lugar correcto. Muy profesionales y atentos.'
    },
    {
      img: 'images/clientes/cliente5.webp',
      titulo: 'Confianza total',
      texto: 'Cumplieron con todo lo prometido. Los documentos están en regla y el trato fue excelente.'
    },
    {
      img: 'images/clientes/cliente6.webp',
      titulo: 'Mi futuro hogar',
      texto: 'Gracias a Innova Corp. hoy tengo la tranquilidad de haber invertido en algo sólido y real.'
    }
  ];

  noticias = [
    {
      id: 1,
      img: 'images/noticias/virgen_sapallanga.webp',
      titulo: 'Impresionante mirador de “Mamacha Cocharcas” en Sapallanga',
      fecha: '4 de enero del 2026'
    },
    {
      id: 2,
      img: 'images/noticias/danzas_sapallanga.webp',
      titulo: 'Coloridos bailes tradicionales llenan de identidad y cultura a Sapallanga',
      fecha: '4 de enero del 2026'
    },
    {
      id: 4,
      img: 'images/noticias/ulla_coto.webp',
      titulo: 'Sitio Arqueológico De Ulla Coto De Sapallanga',
      fecha: '15 de enero del 2026'
    },
    {
      id: 5,
      img: 'images/noticias/mirador_sancristobal.webp',
      titulo: 'Mirador Cerro San Cristóbal De Sapallanga',
      fecha: '20 de enero del 2026'
    }
  ];

  currentIndex = 0;


  nextSlide() {
    if (this.currentIndex < this.clientes.length - 3) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.clientes.length - 3;
    }
  }

  get visibleClientes() {
    return this.clientes.slice(this.currentIndex, this.currentIndex + 3);
  }

  irANoticia(id: number) {
    this.router.navigate(['/noticias'], { queryParams: { id: id } });
  }
}