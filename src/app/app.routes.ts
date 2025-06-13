import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CreaeditarusuariosComponent } from './components/usuarios/creaeditarusuarios/creaeditarusuarios.component';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';
import { CrearEditarBibliotecaComponent } from './components/biblioteca/crear-editar-biblioteca/crear-editar-biblioteca.component';

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
      }
    ]
  },
  {
        path: 'biblioteca',
    component: BibliotecaComponent,
    children: [
      {
        path: 'insertar',
        component: CrearEditarBibliotecaComponent,
      },
    ]
  }
];
