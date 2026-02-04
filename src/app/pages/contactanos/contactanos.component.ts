import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-contactanos',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './contactanos.component.html',
    styleUrls: ['./contactanos.component.css']
})
export class ContactanosComponent {
    mostrarInputPrefijo = signal(false);

    onPrefijoChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this.mostrarInputPrefijo.set(select.value === 'otro');
    }
}
