import { CantidadcomentariosxusuarioComponent } from './components/reportes/cantidadcomentariosxusuario/cantidadcomentariosxusuario.component';
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
import { ReunionComponent } from './components/reunion/reunion.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { DescargasComponent } from './components/descargas/descargas.component';
import { CreareditardescargasComponent } from './components/descargas/creareditardescargas/creareditardescargas.component';
import { CreateEditReunionComponent } from './components/reunion/create-edit-reunion/create-edit-reunion.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { CreateEditComentarioComponent } from './components/comentarios/create-edit-comentario/create-edit-comentario.component';
import { CapitulosdescargadosxusuarioComponent } from './components/reportes/capitulosdescargadosxusuario/capitulosdescargadosxusuario.component';
import { TopThreeCommentatorsComponent } from './components/reportes/top-three-commentators/top-three-commentators.component';
import { NumeroCapitulosComponent } from './components/reportes/numero-capitulos/numero-capitulos.component';
import { CantSuscripcionComponent } from './components/reportes/cant-suscripcion/cant-suscripcion.component';
import { AccesoDenegadoComponent } from './pages/acceso-denegado/acceso-denegado.component';
import { HomeComponent } from './components/home/home.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
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
    path: 'descargas',
    component: DescargasComponent,
    children: [
      {
        path: 'insertar',
        component: CreareditardescargasComponent,
      },
      {
        path: 'editar/:id',
        component: CreareditardescargasComponent,
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
        path: 'actualizar/:id',
        component: CrearEditarBibliotecaComponent,
      },
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
  {
    path: 'reunion',
    component: ReunionComponent,
    children: [
      {
        path: 'insertar',
        component: CreateEditReunionComponent, // Aquí se puede cambiar a un componente específico si es necesario
      },
      {
        path: 'ediciones/:id',
        component: CreateEditReunionComponent, // Aquí se puede cambiar a un componente específico si es necesario
      },
    ],
  },
  {
    path: 'comentario',
    component: ComentariosComponent,
    children: [
      {
        path: 'insertar',
        component: CreateEditComentarioComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreateEditComentarioComponent,
      },
    ],
  },

  /* TODAS LAS RUTAS DE LOS COMPONENTES (ES ANTES DE REPORTES / REPORTES POR ORDEN VA ULTIMO)

  */
  {
    path: 'reportes',
    component: ReportesComponent,
    children: [
      {
        path: 'numero-capitulo',
        component: NumeroCapitulosComponent,
      },
      {
        path: 'reportecapitulosdescargados',
        component: CapitulosdescargadosxusuarioComponent,
      },
      {
        path: 'reportecomentariosxusuarios',
        component: CantidadcomentariosxusuarioComponent,
      },
      {//Victor
        path: 'reporte-top-three-comentarios',
        component: TopThreeCommentatorsComponent,
      },
      {
        path: 'SusccripcionMes',
        component: CantSuscripcionComponent,
      }
    ],
  },
  {
    path: 'acceso-denegado',
    component: AccesoDenegadoComponent,
  },
  {
    path: 'homes',
    component: HomeComponent,
    canActivate: [seguridadGuard],
  },
];
