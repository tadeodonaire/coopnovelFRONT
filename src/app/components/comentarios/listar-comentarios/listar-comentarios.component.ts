import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Comentario } from '../../../models/comentario';
import { ComentarioService } from '../../../services/comentario.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listar-comentarios',
  imports: [
    CommonModule,
    MatTableModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './listar-comentarios.component.html',
  styleUrl: './listar-comentarios.component.css',
})
export class ListarComentariosComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Comentario> = new MatTableDataSource();
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private comS: ComentarioService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const rol = this.loginService.showRole();

    this.displayedColumns = ['c1', 'c2', 'c3', 'c4', 'c5','c6'];

    if (this.isAdministrador()) {
      this.displayedColumns.push('c7'); 
    }

    this.comS.list().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });

    this.comS.getList().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminar(id: number) {
    this.comS.delete(id).subscribe((data) => {
      this.comS.list().subscribe((data) => {
        this.comS.setList(data);
      });
    });
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
