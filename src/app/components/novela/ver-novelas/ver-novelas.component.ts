import { Component, OnInit } from '@angular/core';
import { NovelaService } from '../../../services/novela.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NovelaFullDTO } from '../../../models/NovelaFULLDTO';
import { MatButtonModule } from '@angular/material/button';
import { BibliotecaService } from '../../../services/biblioteca.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Biblioteca } from '../../../models/biblioteca';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Novelasbibliotecas } from '../../../models/novelasbibliotecas';
import { NovelasbibliotecasService } from '../../../services/novelasbibliotecas.service';
import { Novela } from '../../../models/novela';
import { RouterLink } from '@angular/router';

interface NodoCapitulo {
  name: string;
  contenido: string;
}

interface NodoNovela {
  name: string;
  resumen: string;
  genero: string;
  autor: string;
  children: NodoCapitulo[];
}

@Component({
  selector: 'app-ver-novelas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './ver-novelas.component.html',
  styleUrl: './ver-novelas.component.css',
})
export class VerNovelasComponent implements OnInit {
  novelas: NodoNovela[] = [];
  novelasFiltradas: NodoNovela[] = [];
  nombreNovelaFiltro: string = ''; 
  capituloExpandido: { [nombre: string]: boolean } = {};
  selectedBibliotecas: { [novelaName: string]: number } = {};
  misBibliotecas: Biblioteca[] = [];
  novelasbibliotecas: Novelasbibliotecas = new Novelasbibliotecas();

  constructor(
    private novelaService: NovelaService,
    private bibliotecaService: BibliotecaService,
    private nbS: NovelasbibliotecasService
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token!);
    const idUsuario = decoded.idUsuario;

    this.novelaService.getNovelasFull().subscribe((data) => {
      this.novelas = this.agrupar(data);
      this.novelasFiltradas = this.novelas; 
    });

    this.bibliotecaService.listarPorUsuario(idUsuario).subscribe((data) => {
      this.misBibliotecas = data;
    });
  }

  filtrarNovelas(): void {
    if (this.nombreNovelaFiltro.trim()) {
      this.novelasFiltradas = this.novelas.filter(
        (novela) =>
          novela.name
            .toLowerCase()
            .includes(this.nombreNovelaFiltro.toLowerCase()) ||
          novela.autor
            .toLowerCase()
            .includes(this.nombreNovelaFiltro.toLowerCase())
      );
    } else {
      this.novelasFiltradas = this.novelas; 
    }
  }


  restablecerFiltro(): void {
    this.nombreNovelaFiltro = ''; 
    this.novelasFiltradas = this.novelas; 
  }

  agrupar(data: NovelaFullDTO[]): NodoNovela[] {
    const novelas: NodoNovela[] = [];

    data.forEach((d) => {
      let novela = novelas.find((n) => n.name === d.novTitulo);
      if (!novela) {
        novela = {
          name: d.novTitulo,
          resumen: d.novResumen,
          genero: d.novGenero,
          autor: `${d.usNombre} ${d.usApellido} (@${d.username})`,
          children: [],
        };
        novelas.push(novela);
      }

      if (d.idCapitulo && d.capTitulo) {
        const existe = novela.children.find((c) => c.name === d.capTitulo);
        if (!existe) {
          novela.children.push({
            name: d.capTitulo,
            contenido: d.capContenido ?? '(Sin contenido)',
          });
        }
      }
    });

    return novelas;
  }

  toggleCapitulo(nombre: string): void {
    this.capituloExpandido[nombre] = !this.capituloExpandido[nombre];
  }

  isCapituloExpanded(nombre: string): boolean {
    return this.capituloExpandido[nombre] ?? false;
  }

  agregarNovelaABiblioteca(nombreNovela: string): void {
    const idBiblioteca = this.selectedBibliotecas[nombreNovela];
    if (!idBiblioteca) {
      alert('Por favor selecciona una biblioteca válida.');
      return;
    }

    // Buscar el ID de la novela usando el título
    this.novelaService.getNovelasFull().subscribe((data) => {
      const novelaDTO = data.find((n) => n.novTitulo === nombreNovela);
      if (!novelaDTO) {
        alert('No se encontró la novela correspondiente.');
        return;
      }

      const nuevaRelacion = new Novelasbibliotecas();
      nuevaRelacion.biblioteca = new Biblioteca();
      nuevaRelacion.biblioteca.idBiblioteca = idBiblioteca;

      nuevaRelacion.novelas = new Novela();
      nuevaRelacion.novelas.idNovela = novelaDTO.idNovela;

      this.nbS.insert(nuevaRelacion).subscribe({
        next: () => {
          alert(
            `✅ Novela "${nombreNovela}" agregada a la biblioteca exitosamente.`
          );
        },
        error: (err) => {
          console.error('Error al agregar la novela:', err);
          alert('❌ Hubo un error al agregar la novela.');
        },
      });
    });
  }
}
