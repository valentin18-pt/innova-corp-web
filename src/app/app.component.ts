import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, Event, Scroll } from '@angular/router';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { initFlowbite } from 'flowbite';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="pt-20"> <!-- Added padding for fixed header -->
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class AppComponent implements OnInit {
  title = 'innova-corp-web';
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  constructor() {
    this.router.events.pipe(
      filter((e: Event): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.anchor) {
        setTimeout(() => {
          this.viewportScroller.scrollToAnchor(e.anchor!);
        }, 100);
      }
    });

    // Configure scroll offset globally
    if (isPlatformBrowser(this.platformId)) {
      this.viewportScroller.setOffset([0, 250]);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
      document.documentElement.classList.remove('dark');
    }
  }
}
