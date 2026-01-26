import { Routes } from '@angular/router';
import { InicioComponent } from './pages/Inicio/inicio.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';

import { ContactanosComponent } from './pages/contactanos/contactanos.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contactanos', component: ContactanosComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];