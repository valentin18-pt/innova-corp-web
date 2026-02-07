import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-whatsapp-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './whatsapp-button.component.html',
    styleUrl: './whatsapp-button.component.css'
})
export class WhatsAppButtonComponent {
    openWhatsApp() {
        window.open('https://wa.me/51993661193?text=Hola,%20me%20gustaria%20recibir%20informacion%20sobre%20un%20lote.', '_blank');
    }
}
