import { Component, OnDestroy, OnInit } from '@angular/core';
import { VerLibrosService } from '../../services/ver-libros.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-ver-libros',
  imports: [CommonModule],
  templateUrl: './ver-libros.component.html',
  styleUrl: './ver-libros.component.css',
})

 export class VerLibrosComponent implements OnInit, OnDestroy {
  titulo: string = '';
  descripcion: string = '';
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

  constructor(private librosService: VerLibrosService) {}

  ngOnInit(): void {
    // ✅ Modo real: cada 24h = 86400000 ms
    //const intervaloTiempo = 86400000;

    // 🔁 Modo prueba: cada 3 segundos
    const intervaloTiempo = 3000;

    this.cargarLibro(); // Llamada inicial inmediata

    this.intervaloSub = interval(intervaloTiempo).subscribe(() => {
      this.cargarLibro();
    });
  }

  ngOnDestroy(): void {
    if (this.intervaloSub) {
      this.intervaloSub.unsubscribe();
    }
  }

  private cargarLibro(): void {
    const ahora = Date.now();

    // Cambia la base para que el resultado sea consistente por intervalo
    //const unidad = 86400000; // día (para modo real)

    const unidad = 3000; // prueba: cambia cada 3s

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
              item.volumeInfo?.title &&
              item.volumeInfo?.imageLinks?.thumbnail
          );

          if (librosValidos && librosValidos.length > 0) {
            const libroIndex =
              this.seededRandom(baseTiempo * 31 + 19) %
              librosValidos.length;
            const libroSeleccionado =
              librosValidos[libroIndex].volumeInfo;

            this.titulo = libroSeleccionado.title;
            this.imagen = libroSeleccionado.imageLinks?.thumbnail || '';
            this.descripcion =
              libroSeleccionado.description || 'Descripción no disponible.';
            this.autor =
              libroSeleccionado.authors?.join(', ') || 'Autor no especificado';
          } else {
            this.titulo =
              'No se encontró ningún libro con título y portada.';
            this.imagen = '';
            this.descripcion = '';
            this.autor = '';
          }
        },
        error: () => {
          this.titulo = 'Error al obtener libros.';
          this.imagen = '';
          this.descripcion = '';
          this.autor = '';
        },
      });
  }

  /**
   * Generador de número pseudoaleatorio determinista.
   */
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return Math.abs(Math.floor((x - Math.floor(x)) * 1000000));
  }
}