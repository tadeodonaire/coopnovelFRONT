import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuarios';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';

@Component({
  selector: 'app-listarusuarios',
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
  ],
  templateUrl: './listarusuarios.component.html',
  styleUrl: './listarusuarios.component.css',
})
export class ListarusuariosComponent implements OnInit {
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  paginatedData: Usuario[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'birthday',
    'correo',
    'usuario',
    'estado',
    'editar',
    'eliminar',
  ];

  constructor(private uS: UsuariosService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.uS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.updatePaginatedData(0, 6); // Primera página
    });
    this.uS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.updatePaginatedData(0, 6); // Primera página
    });
  }

  updatePaginatedData(startIndex: number, pageSize: number) {
    const data = this.dataSource.data;
    this.paginatedData = data.slice(startIndex, startIndex + pageSize);
  }

  onPageChange(event: PageEvent) {
    this.updatePaginatedData(event.pageIndex * event.pageSize, event.pageSize);
  }

  eliminar(id: number) {
    this.uS.deleteU(id).subscribe({
      next: () => {
        // Recargar lista
        this.uS.list().subscribe((data) => {
          this.uS.setList(data);
        });

        // Mostrar confirmación
        this.snackBar.open(
          '✅ El usuario se eliminó correctamente.',
          'Cerrar',
          {
            duration: 4000,
            panelClass: ['snackbar-success'],
          }
        );
      },
      error: (error) => {
        if (error.status === 500) {
          this.snackBar.open(
            '❌ No se puede eliminar el usuario porque tiene datos vinculados en la cuenta.',
            'Cerrar',
            {
              duration: 15000,
              panelClass: ['snackbar-error'],
            }
          );
        } else {
          this.snackBar.open(
            '⚠️ Error inesperado al intentar eliminar el usuario.',
            'Cerrar',
            {
              duration: 5000,
              panelClass: ['snackbar-error'],
            }
          );
        }
      },
    });
  }
}
