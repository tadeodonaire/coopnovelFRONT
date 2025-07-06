import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Capitulos } from '../../../models/capitulos';
import { CapituloService } from '../../../services/capitulo.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarcapitulos',
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './listarcapitulos.component.html',
  styleUrl: './listarcapitulos.component.css',
})
export class ListarcapitulosComponent {
  dataSource: MatTableDataSource<Capitulos> = new MatTableDataSource();
  displayedColumns: string[] = [];

  constructor(
    private cS: CapituloService,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    const rol = this.loginService.showRole();

    // Columnas básicas visibles para todos los roles
    this.displayedColumns = ['novela', 'titulo', 'contenido', 'id'];

    // Agregamos columnas condicionalmente
    if (rol === 'ADMINISTRADOR') {
      this.displayedColumns.push('editar', 'eliminar', 'addComment');
    } else if (rol === 'AUTOR') {
      this.displayedColumns.push('editar', 'addComment');
    }

    // Llenamos los datos
    this.cS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.cS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.cS.deleteC(id).subscribe(() => {
      this.cS.list().subscribe((data) => {
        this.cS.setList(data);
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

  addComment() {
    // Navegar a la ruta de insertar comentario
    this.router.navigate(['/comentario/insertar']);
  }
}
