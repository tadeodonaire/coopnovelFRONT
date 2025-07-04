import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { VerLibrosService } from '../../services/ver-libros.service';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatSidenavModule,
    CommonModule,
    MatListModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit, OnDestroy {
  role: string = '';
  isExpanded = false;
  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  // Recomendación del día
  titulo: string = '';
  autor: string = '';
  imagen: string = '';

  private temas = [
    'fantasía',
    'ciencia',
    'arte',
    'novela',
    'historia',
    'misterio',
  ];
  private intervaloSub!: Subscription;

  constructor(
    private librosService: VerLibrosService,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const intervaloTiempo = 86400000; // producción: 24 horas
    //const intervaloTiempo = 3000; // pruebas: 3 segundos

    this.cargarLibro();

    this.intervaloSub = interval(intervaloTiempo).subscribe(() => {
      this.cargarLibro();
    });

    if (sessionStorage.getItem('logoutSuccess') === 'true') {
      sessionStorage.removeItem('logoutSuccess');
      this.snackBar.open('Sesión cerrada con éxito 😊', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  ngOnDestroy(): void {
    this.intervaloSub?.unsubscribe();
  }

  private cargarLibro(): void {
    const ahora = Date.now();
    const unidad = 86400000; // producción
    //const unidad = 3000; // pruebas
    const baseTiempo = Math.floor(ahora / unidad);

    const generoIndex =
      this.seededRandom(baseTiempo * 13 + 7) % this.temas.length;
    const temaAleatorio = this.temas[generoIndex];
    const startIndex = this.seededRandom(baseTiempo * 17 + 3) % 30;

    this.librosService
      .obtenerLibroPorTema(temaAleatorio, startIndex)
      .subscribe({
        next: (data) => {
          const librosValidos = data.items?.filter(
            (item: any) =>
              item.volumeInfo?.title && item.volumeInfo?.imageLinks?.thumbnail
          );

          if (librosValidos?.length > 0) {
            const libroIndex =
              this.seededRandom(baseTiempo * 31 + 19) % librosValidos.length;
            const libro = librosValidos[libroIndex].volumeInfo;

            this.titulo = libro.title;
            this.imagen = libro.imageLinks?.thumbnail || '';
            this.autor = libro.authors?.join(', ') || 'Autor no especificado';
          } else {
            this.titulo = 'No se encontró libro';
            this.imagen = '';
            this.autor = '';
          }
        },
        error: () => {
          this.titulo = 'Error al obtener libros.';
          this.imagen = '';
          this.autor = '';
        },
      });
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return Math.abs(Math.floor((x - Math.floor(x)) * 1000000));
  }

  cerrar() {
    sessionStorage.clear();
    sessionStorage.setItem('logoutSuccess', 'true');
    window.location.href = '/login';
  }

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }
  isAdministrador() {
    return this.role === 'ADMINISTRADOR';
  }
  isColaborador() {
    return this.role === 'COLABORADOR';
  }
  isLector() {
    return this.role === 'LECTOR';
  }
  isAutor() {
    return this.role === 'AUTOR';
  }
}
