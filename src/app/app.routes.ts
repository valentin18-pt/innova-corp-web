import { Routes } from '@angular/router';
import { InicioComponent } from './pages/Inicio/inicio.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';

import { ContactanosComponent } from './pages/contactanos/contactanos.component';
import { ProyectosComponent } from './pages/proyectos/proyectos.component';
import { CircunvalacionComponent } from './pages/proyectos/circunvalacion/circunvalacion.component';
import { EucaliptosComponent } from './pages/proyectos/eucaliptos/eucaliptos.component';
import { TerminoCondicion } from './pages/termino-condicion/termino-condicion';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contactanos', component: ContactanosComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'proyectos/circunvalacion', component: CircunvalacionComponent },
  { path: 'proyectos/eucaliptos', component: EucaliptosComponent },
  { path: 'terminos-y-condiciones', component: TerminoCondicion },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];