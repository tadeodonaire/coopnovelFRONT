import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Proyecto } from '../../../models/proyecto';
import { ProyectoService } from '../../../services/proyecto.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LoginService } from '../../../services/login.service';
import { MatCardModule } from '@angular/material/card';
import { filter } from 'rxjs';

@Component({
  selector: 'app-listarproyectos',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatPaginatorModule,
    MatCardModule,
  ],
  templateUrl: './listarproyectos.component.html',
  styleUrl: './listarproyectos.component.css',
})
export class ListarproyectosComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Proyecto> = new MatTableDataSource();
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private pS: ProyectoService,
    private snacbar: MatSnackBar,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
 const rol = this.loginService.showRole();
  this.displayedColumns = ['c1', 'c2', 'c3', 'c4'];
  if (rol === 'ADMINISTRADOR' || rol === 'COLABORADOR' || rol === 'AUTOR') {
    this.displayedColumns.push('c5', 'c6');
  }

  // Escuchar navegación
  this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      this.cargarProyectos();
    });

  this.cargarProyectos();
  }
  cargarProyectos(): void {
    const rol = this.loginService.showRole();
    const idUsuario = this.loginService.getUserId();

    this.pS.list().subscribe((data) => {
      let proyectosFiltrados = data;

      if (rol !== 'ADMINISTRADOR') {
        proyectosFiltrados = data.filter(
          (proy) => proy.usario.idUsuario === idUsuario
        );
      }

      this.dataSource.data = proyectosFiltrados;
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    this.pS.deleteP(id).subscribe(() => {
      this.pS.list().subscribe((data) => {
        const rol = this.loginService.showRole();
        const idUsuario = this.loginService.getUserId();

        let proyectosFiltrados = data;
        if (rol !== 'ADMINISTRADOR') {
          proyectosFiltrados = data.filter(
            (proy) => proy.usario.idUsuario === idUsuario
          );
        }

        this.dataSource.data = proyectosFiltrados;
      });
    });

    this.snacbar.open('Se eliminó correctamente', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAdministrador(): boolean {
    return this.loginService.showRole() === 'ADMINISTRADOR';
  }

  isAutor(): boolean {
    return this.loginService.showRole() === 'AUTOR';
  }

  isColaborador(): boolean {
    return this.loginService.showRole() === 'COLABORADOR';
  }
}
