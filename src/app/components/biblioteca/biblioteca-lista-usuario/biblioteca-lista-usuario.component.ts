import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { BibliotecaDTO } from '../../../models/BibliotecaFULLDTO';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface NodoCapitulo {
  name: string;
  contenido: string;
}

interface NodoNovela {
  name: string;
  resumen: string;
  genero: string;
  proyecto: string;
  children: NodoCapitulo[];
}

@Component({
  selector: 'app-biblioteca-lista-usuario',
  standalone: true,
  imports: [CommonModule, MatIconModule,MatButtonModule],
  templateUrl: './biblioteca-lista-usuario.component.html',
  styleUrls: ['./biblioteca-lista-usuario.component.css'],
})
export class BibliotecaListaUsuarioComponent implements OnInit {
  novelas: NodoNovela[] = [];
  capituloExpandido: { [nombre: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuariosService
  ) {}

ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
    const idBiblioteca = +params['id'];
    const idUsuario = 1; // fija temporal, usa AuthService luego

    this.usuarioService.getBibliotecaFull(idUsuario).subscribe((data) => {
      console.log('📦 Data completa del usuario:', data);
      const dataFiltrada = data.filter(d => d.idBiblioteca === idBiblioteca);
      console.log('🎯 Data filtrada por biblioteca', idBiblioteca, ':', dataFiltrada);

      this.novelas = this.agrupar(dataFiltrada);
    });
  });
}


  agrupar(data: BibliotecaDTO[]): NodoNovela[] {
  const novelas: NodoNovela[] = [];

  data.forEach((d) => {
    let novela = novelas.find((n) => n.name === d.novTitulo);
    if (!novela) {
      novela = {
        name: d.novTitulo,
        resumen: d.novResumen,
        genero: d.novGenero,
        proyecto: d.proyTitulo,
        children: [],
      };
      novelas.push(novela);
    }

    if (d.idCapitulo && d.capTitulo) {
      const capExiste = novela.children.find((c) => c.name === d.capTitulo);
      if (!capExiste) {
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
}
