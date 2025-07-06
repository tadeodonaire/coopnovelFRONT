import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Router, RouterOutlet } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-biblioteca-main',
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatCardModule,
    RouterOutlet,
  ],
  templateUrl: './biblioteca-main.component.html',
  styleUrl: './biblioteca-main.component.css',
})
export class BibliotecaMainComponent implements OnInit {
  bibliotecasUnicas: { id: number; nombre: string }[] = [];

  constructor(
    private usuarioService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token!);
    const idUsuario = decoded.idUsuario;
    //const idUsuario = 1; // luego puedes hacerlo dinámico con AuthService
    console.log('ID', idUsuario);


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
