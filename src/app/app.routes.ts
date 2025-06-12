import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ListarusuariosComponent } from './components/usuarios/listarusuarios/listarusuarios.component';
import { CreaeditarusuariosComponent } from './components/usuarios/creaeditarusuarios/creaeditarusuarios.component';

export const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosComponent,
    children: [
      {
        path: 'insertar',
        component: CreaeditarusuariosComponent,
      },
    ]
  }
];
