import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CreaeditarusuariosComponent } from './components/usuarios/creaeditarusuarios/creaeditarusuarios.component';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';
import { CrearEditarBibliotecaComponent } from './components/biblioteca/crear-editar-biblioteca/crear-editar-biblioteca.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { CreareditarproyectosComponent } from './components/proyectos/creareditarproyectos/creareditarproyectos.component';
import { NovelaComponent } from './components/novela/novela.component';
import { CreareditarnovelaComponent } from './components/novela/creareditarnovela/creareditarnovela.component';
import { CapituloComponent } from './components/capitulo/capitulo.component';
import { CreaeditacapitulosComponent } from './components/capitulo/creaeditacapitulos/creaeditacapitulos.component';

export const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosComponent,
    children: [
      {
        path: 'insertar',
        component: CreaeditarusuariosComponent,
      },
      {
        path: 'editar/:id',
        component: CreaeditarusuariosComponent,
      },
    ],
  },
  {
    path: 'biblioteca',
    component: BibliotecaComponent,
    children: [
      {
        path: 'insertar',
        component: CrearEditarBibliotecaComponent,
      },
      {
        path:'actualizar/:id',
        component: CrearEditarBibliotecaComponent
      }
    ],
  },

  {
    path: 'proyecto',
    component: ProyectosComponent,
    children: [
      {
        path: 'insertar',
        component: CreareditarproyectosComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarproyectosComponent,
      },
    ],
  },

  {
    path: 'novela',
    component: NovelaComponent,
    children: [
      {
        path: 'insertar',
        component: CreareditarnovelaComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarnovelaComponent,
      },
    ],
  },
  {
    path: 'capitulo',
    component: CapituloComponent,
    children: [
      {
        path: 'insertar',
        component: CreaeditacapitulosComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreaeditacapitulosComponent,
      },
    ],
  },
];
