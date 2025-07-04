import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CorreccionesIA } from '../../../models/correccionesIA';
import { CorreccionIAService } from '../../../services/correccion-ia.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarcorrecciones-ia',
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './listarcorrecciones-ia.component.html',
  styleUrl: './listarcorrecciones-ia.component.css',
})
export class ListarcorreccionesIAComponent {
  dataSource: MatTableDataSource<CorreccionesIA> = new MatTableDataSource();
  displayedColumns: string[] = [];

  constructor(
    private coS: CorreccionIAService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const rol = this.loginService.showRole();
    this.displayedColumns = ['id', 'capitulo', 'correccion', 'eliminar'];
    if (rol === 'ADMINISTRADOR' || rol === 'COLABORADOR' || rol === 'AUTOR') {
      this.displayedColumns.push('editar');
    }

    this.coS.list().subscribe((data) => {
      this.coS.setList(data);
    });
    this.coS.getList().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  eliminar(id: number) {
    this.coS.deleteCorreccionIA(id).subscribe((data) => {
      this.coS.list().subscribe((data) => {
        this.coS.setList(data);
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
