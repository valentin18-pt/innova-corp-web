
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-proyectos',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './proyectos.component.html',
    styleUrl: './proyectos.component.css'
})
export class ProyectosComponent { }
