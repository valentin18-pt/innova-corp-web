import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
  isProjectsOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeTimeout: any;

  toggleProjects() {
    this.isProjectsOpen = !this.isProjectsOpen;
  }

  closeProjects() {
    this.isProjectsOpen = false;
  }

  enterProjects() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.isProjectsOpen = true;
  }

  leaveProjects() {
    this.closeTimeout = setTimeout(() => {
      this.isProjectsOpen = false;
    }, 100);
  }
}