import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { LoginService } from '../../services/login.service';
import { interval, Subscription } from 'rxjs';
import { VerLibrosService } from '../../services/ver-libros.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  usNombre: string = '';
  usApellido: string = '';

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
    private loginService: LoginService,
    private usuarioService: UsuariosService,
    private librosService: VerLibrosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const username = this.loginService.getUsername();
    if (username) {
      this.usuarioService.list().subscribe((usuarios) => {
        const usuario = usuarios.find((u) => u.username === username);
        if (usuario) {
          this.usNombre = usuario.usNombre;
          this.usApellido = usuario.usApellido;
        }
      });
    }

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
}
