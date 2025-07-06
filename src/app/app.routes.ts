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
import { CorreccionIAComponent } from './components/correccion-ia/correccion-ia.component';
import { CreareditarcorreccionesIAComponent } from './components/correccion-ia/creareditarcorrecciones-ia/creareditarcorrecciones-ia.component';
import { NovelasbibliotecasComponent } from './components/novelasbibliotecas/novelasbibliotecas.component';
import { CreareditarnovelasbibliotecasComponent } from './components/novelasbibliotecas/creareditarnovelasbibliotecas/creareditarnovelasbibliotecas.component';
import { SuscripcionesComponent } from './components/suscripciones/suscripciones.component';
import { CreareditarsuscripcionesComponent } from './components/suscripciones/creareditarsuscripciones/creareditarsuscripciones.component';
import { AccesoDenegadoComponent } from './pages/acceso-denegado/acceso-denegado.component';
import { HomeComponent } from './components/home/home.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { LoginComponent } from './components/login/login.component';
import { RolesComponent } from './components/roles/roles.component';
import { CreaeditarolesComponent } from './components/roles/creaeditaroles/creaeditaroles.component';
import { BibliotecaMainComponent } from './components/biblioteca/biblioteca-main/biblioteca-main.component';
import { BibliotecaListaUsuarioComponent } from './components/biblioteca/biblioteca-lista-usuario/biblioteca-lista-usuario.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { BuscarUsuarioComponent } from './components/suscripciones/buscar-usuario/buscar-usuario.component';
import { SuscritoMoreOnceComponent } from './components/reportes/suscrito-more-once/suscrito-more-once.component';
import { VerNovelasComponent } from './components/novela/ver-novelas/ver-novelas.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'usuarios/insertar',
    component: CreaeditarusuariosComponent,
    canActivate: [seguridadGuard], // importante: sigue usando el guard
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
  },
  {
    path: 'usuarios/editar/:id',
    component: CreaeditarusuariosComponent,
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
    canActivate: [seguridadGuard],
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
    canActivate: [seguridadGuard],
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
    canActivate: [seguridadGuard],
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
      {
        path: 'ver',
        component: VerNovelasComponent,
      }
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'capitulo',
    component: CapituloComponent,
    canActivate: [seguridadGuard],
    children: [
      { path: 'insertar/:novelaId', component: CreaeditacapitulosComponent },
      {
        path: 'ediciones/:id',
        component: CreaeditacapitulosComponent,
        canActivate: [seguridadGuard],
        data: { rolesPermitidos: ['ADMINISTRADOR', 'AUTOR'] },
      },
    ],
  },

  {
    path: 'reunion',
    component: ReunionComponent,
    children: [
      {
        path: 'insertar',
        component: CreateEditReunionComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreateEditReunionComponent,
      },
    ],
    canActivate: [seguridadGuard],
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
    canActivate: [seguridadGuard],
  },
  {
    path: 'correccionIA',
    component: CorreccionIAComponent,
    children: [
      {
        path: 'insertar/:id',
        component: CreareditarcorreccionesIAComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarcorreccionesIAComponent,
      },
    ],
  },
  {
    path: 'novelasbibliotecas',
    component: NovelasbibliotecasComponent,
    children: [
      {
        path: 'insertar',
        component: CreareditarnovelasbibliotecasComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreareditarnovelasbibliotecasComponent,
      },
    ],
  },
  {
    path: 'suscripciones',
    component: SuscripcionesComponent,
    children: [
      {
        path: 'insertar',
        component: CreareditarsuscripcionesComponent,
      },
      {
        path: 'editar/:id',
        component: CreareditarsuscripcionesComponent,
      },
      {
        path: 'cantidad-suscripciones',
        component: BuscarUsuarioComponent,
      },
    ],
  },
  {
    path: 'roles',
    component: RolesComponent,
    children: [
      {
        path: 'insertar',
        component: CreaeditarolesComponent,
      },
      {
        path: 'ediciones/:id',
        component: CreaeditarolesComponent,
      },
    ],
    canActivate: [seguridadGuard],
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
      {
        path: 'suscripcion-mes', // corregido
        component: CantSuscripcionComponent,
      },
      {
        path: 'top-three-comentarios', // mejor nombre para URL
        component: TopThreeCommentatorsComponent,
      },
      {
        path: 'usuarios-suscritos',
        component: SuscritoMoreOnceComponent,
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
  {
    path: 'biblioteca-full',
    component: BibliotecaMainComponent,
    children: [
      {
        path: 'usuario',
        component: BibliotecaListaUsuarioComponent,
      },
    ],
  },
  {
    path: 'inicio',
    component: InicioComponent,
  },
];
