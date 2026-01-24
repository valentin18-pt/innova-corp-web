import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-contactanos',
    standalone: true,
    imports: [CommonModule],
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
