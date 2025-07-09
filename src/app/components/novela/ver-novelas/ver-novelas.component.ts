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
import { Comentario } from '../../../models/comentario';
import { ComentarioService } from '../../../services/comentario.service';
import { ComentarioDTO } from '../../../models/ComentarioDTO';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuarios';
import { RouterLink } from '@angular/router';
import { ComentariosNovelaDTO } from '../../../models/ComentariosNovelaDTO';

interface NodoCapitulo {
  id: number;
  name: string;
  contenido: string;
}

interface NodoNovela {
  id: number;
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
  comentariosPorCapitulo: { [capituloNombre: string]: string } = {};
  comentariosCargados: { [capituloId: number]: ComentarioDTO[] } = {};
  usuarioActual:Usuario = new Usuario();
  comentariosPorNovela: { [novelaTitulo: string]: ComentariosNovelaDTO[] } = {};


  constructor(
    private novelaService: NovelaService,
    private bibliotecaService: BibliotecaService,
    private nbS: NovelasbibliotecasService,
    private comentarioService: ComentarioService,
    private usuarioService:UsuariosService
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token!);
    const idUsuario = decoded.idUsuario;

      this.usuarioService.listId(idUsuario).subscribe(user => {
    this.usuarioActual = user;
  });

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
    let novela = novelas.find((n) => n.id === d.idNovela);
    if (!novela) {
      novela = {
        id: d.idNovela, // <--- guardar el id aquí
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
            id: d.idCapitulo,
            name: d.capTitulo,
            contenido: d.capContenido ?? '(Sin contenido)',
          });
        }
      }
    });

    return novelas;
  }

 toggleCapitulo(novela: NodoNovela, capitulo: NodoCapitulo): void {
  const capituloNombre = capitulo.name;
  const capituloId = capitulo.id;

  this.capituloExpandido[capituloNombre] = !this.capituloExpandido[capituloNombre];

  if (!this.comentariosCargados[capituloId]) {
this.novelaService
  .getComentariosPorNovela(novela.id)
  .subscribe((comentarios) => {
    const comentariosDelCapitulo = comentarios
      .filter((c) => c.idCapitulo === capituloId)
      .map((c) => ({
        idComentario: c.idComentario,
        comContenido: c.contenido,          // ✅ contenido va aquí
        comFecha: new Date(c.fecha),
        usuario: {
          idUsuario: c.idUsuario,
          usNombre: c.username,      // ⚠️ username usado como nombre
          usApellido: c.usApellido,
          username: c.username,
        },
        capitulo: {
          idCapitulo: c.idCapitulo,
          capTitulo: c.capTitulo,
        },
      }));

    this.comentariosCargados[capituloId] = comentariosDelCapitulo;
  });

  }
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

  publicarComentario(idCapitulo: number, capituloNombre: string): void {
    const contenido = this.comentariosPorCapitulo[capituloNombre];
    if (!contenido || contenido.trim() === '') {
      alert('El comentario no puede estar vacío.');
      return;
    }

    const token = sessionStorage.getItem('token');
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token!);
    const idUsuario = decoded.idUsuario;
    const usNombre = decoded.sub;
    console.log("El token",decoded)

    const comentario = new Comentario();
    comentario.comContenido = contenido;
    comentario.comFecha = new Date();
    comentario.usuario.idUsuario = idUsuario;
    comentario.capitulo.idCapitulo = idCapitulo;

    this.comentarioService.insert(comentario).subscribe({
      next: (comentarioGuardado) => {
        console.log('comentario guardado:', comentarioGuardado);
        const nuevoComentarioDTO: ComentarioDTO = {
          idComentario: comentarioGuardado.idComentario,
          comContenido: comentarioGuardado.comContenido,
          comFecha: comentarioGuardado.comFecha,
          usuario: {
            idUsuario: idUsuario,
            usNombre: usNombre,
            usApellido: this.usuarioActual.usApellido,
            username: this.usuarioActual.username,
          },
          capitulo: {
            idCapitulo: idCapitulo,
            capTitulo: capituloNombre,
          },
        };

        if (!this.comentariosCargados[idCapitulo]) {
          this.comentariosCargados[idCapitulo] = [];
        }
        this.comentariosCargados[idCapitulo].unshift(nuevoComentarioDTO);
console.log('nuevoComentarioDTO:', nuevoComentarioDTO);
        this.comentariosPorCapitulo[capituloNombre] = '';
      },
    });
  }
}
