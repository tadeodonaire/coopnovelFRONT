import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Reunion } from '../../../models/reuniones';
import { ReunionService } from '../../../services/reunion.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listar-reunion',
  imports: [
    CommonModule,
    MatTableModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './listar-reunion.component.html',
  styleUrl: './listar-reunion.component.css',
})
export class ListarReunionComponent implements OnInit, AfterViewInit{
  dataSource: MatTableDataSource<Reunion> = new MatTableDataSource();
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private reunionService: ReunionService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const rol = this.loginService.showRole();
    this.displayedColumns = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

    if (rol === 'ADMINISTRADOR' || rol === 'AUTOR') {
      this.displayedColumns.push('c8');
    }

    this.reunionService.list().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });

    this.reunionService.getList().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminar(id: number) {
    this.reunionService.delete(id).subscribe((data) => {
      this.reunionService.list().subscribe((data) => {
        this.reunionService.setList(data);
      });
    });
  }

  isAdministrador(): boolean {
    return this.loginService.showRole() === 'ADMINISTRADOR';
  }

  isAutor(): boolean {
    return this.loginService.showRole() === 'AUTOR';
  }
}
