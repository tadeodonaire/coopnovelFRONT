import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BibliotecaListaUsuarioComponent } from '../biblioteca-lista-usuario/biblioteca-lista-usuario.component';
import { CrearEditarBibliotecaComponent } from '../crear-editar-biblioteca/crear-editar-biblioteca.component';
import { filter } from 'rxjs';
@Component({
  selector: 'app-biblioteca-main',
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatCardModule,
    RouterOutlet,
    CrearEditarBibliotecaComponent,
  ],
  templateUrl: './biblioteca-main.component.html',
  styleUrl: './biblioteca-main.component.css',
})
export class BibliotecaMainComponent implements OnInit {
  listaBibliotecaComp!: BibliotecaListaUsuarioComponent;

  bibliotecasUnicas: { id: number; nombre: string }[] = [];

  mostrarFormulario = false;
  onBibliotecaCreada() {
    this.listaBibliotecaComp.ngOnInit();
    this.cargarBibliotecas(); // Método que actualiza `bibliotecasUnicas`
    this.mostrarFormulario = false;
  }

  constructor(
    private usuarioService: UsuariosService,
    private router: Router
  ) {
    this.router.events
  .pipe(filter((event) => event instanceof NavigationEnd))
  .subscribe((event: any) => {
    // Si vuelve a /biblioteca-full
    if (event.urlAfterRedirects.includes('/biblioteca-full')) {
      this.cargarBibliotecas();
    }
  });
  }

  ngOnInit(): void {
    this.cargarBibliotecas();
  }
  cargarBibliotecas(): void {
    const token = sessionStorage.getItem('token');
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token!);
    const idUsuario = decoded.idUsuario;

    this.usuarioService.getBibliotecaFull(idUsuario).subscribe((data) => {
      const nombresUnicos = new Map<number, string>();

      data.forEach((d) => {
        if (!nombresUnicos.has(d.idBiblioteca)) {
          nombresUnicos.set(d.idBiblioteca, d.bibNombre);
        }
      });

      this.bibliotecasUnicas = Array.from(nombresUnicos, ([id, nombre]) => ({
        id,
        nombre,
      }));
    });
  }

  irABiblioteca(id: number) {
    this.router.navigate(['/biblioteca-full/usuario'], { queryParams: { id } });
  }
  irACrearBiblioteca() {
    this.router.navigate(['/biblioteca/insertar']); // Asegúrate de que esta ruta exista
  }
}
