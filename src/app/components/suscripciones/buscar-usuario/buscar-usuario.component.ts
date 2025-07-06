import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CantidadSuscripcionesDTO } from '../../../models/cantidadSuscripcionesDTO';
import { SuscripcionesService } from '../../../services/suscripciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Suscripciones } from '../../../models/suscripciones';
import { LoginService } from '../../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-buscar-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-usuario.component.html',
  styleUrl: './buscar-usuario.component.css',
})
export class BuscarUsuarioComponent implements OnInit {
  dataSource: MatTableDataSource<CantidadSuscripcionesDTO> = new MatTableDataSource<CantidadSuscripcionesDTO>();
  displayedColumns: string[] = ['nombre', 'apellido', 'suscriptores', 'novelas'];
  filtro: string = '';


  usNombre: string = '';
  usApellido: string = '';
  idSuscriptor: number | null = null; 

  constructor(
    private loginService: LoginService,
    private sS: SuscripcionesService,
    private usuarioService: UsuariosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    const username = this.loginService.getLoggedUsername();
    if (username) {
  
      this.usuarioService.list().subscribe((usuarios) => {
        const usuario = usuarios.find((u) => u.username === username);
        if (usuario) {
          this.usNombre = usuario.usNombre;
          this.usApellido = usuario.usApellido;
          this.idSuscriptor = usuario.idUsuario; 
        }
      });
    }


    this.sS.getEscritores().subscribe((data) => {
      this.dataSource.data = data;

 
      this.dataSource.data.forEach((escritor) => {
        const suscritoKey = `suscrito_${escritor.idUsuario}`;
        escritor.suscrito = sessionStorage.getItem(suscritoKey) !== null;
      });


      this.dataSource.filterPredicate = (data: CantidadSuscripcionesDTO, filter: string): boolean => {
        const term = filter.trim().toLowerCase();
        return (
          data.nombre.toLowerCase().includes(term) ||
          data.apellido.toLowerCase().includes(term) ||
          data.novelas.toLowerCase().includes(term)
        );
      };
    });
  }


  suscribirse(idSuscrito: number): void {
    if (!this.idSuscriptor) {
      this.snackBar.open('No se pudo obtener el usuario logueado.', 'Cerrar', { duration: 3000 });
      return;
    }

    const suscripcion: Suscripciones = {
      idSuscripcion: 0,
      susFechaInicio: new Date(),
      suscriptor: { idUsuario: this.idSuscriptor } as any,
      suscrito: { idUsuario: idSuscrito } as any,
    };


    const suscritoKey = `suscrito_${idSuscrito}`;
    if (sessionStorage.getItem(suscritoKey)) {
      this.snackBar.open('Ya estás suscrito a este escritor.', 'Cerrar', { duration: 3000 });
      return;
    }

   
    this.sS.insert(suscripcion).subscribe({
      next: () => {
 
        sessionStorage.setItem(suscritoKey, 'true');
        this.snackBar.open('Te suscribiste exitosamente.', 'Cerrar', { duration: 3000 });
        this.marcarSuscrito(idSuscrito, true);
      },
      error: () => {
        this.snackBar.open('No se pudo suscribir.', 'Cerrar', { duration: 3000 });
      },
    });
  }


  desuscribirse(idSuscrito: number): void {
    if (!this.idSuscriptor) {
      this.snackBar.open('No se pudo obtener el usuario logueado.', 'Cerrar', { duration: 3000 });
      return;
    }

  
    this.sS.eliminarPorUsuarios(this.idSuscriptor, idSuscrito).subscribe({
      next: () => {
        
        const suscritoKey = `suscrito_${idSuscrito}`;
        sessionStorage.removeItem(suscritoKey); 

        this.snackBar.open('Te has desuscrito exitosamente.', 'Cerrar', { duration: 3000 });
        this.marcarSuscrito(idSuscrito, false); 
      },
      error: () => {
        this.snackBar.open('No se pudo desuscribir.', 'Cerrar', { duration: 3000 });
      },
    });
  }


  marcarSuscrito(idUsuario: number, estado: boolean): void {
    const escritor = this.dataSource.data.find(
      (e) => e.idUsuario === idUsuario
    );
    if (escritor) {
      escritor.suscrito = estado;
    }
  }


  buscar(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase(); 
  }
}