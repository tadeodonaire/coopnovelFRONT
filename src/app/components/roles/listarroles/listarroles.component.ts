import { Component, OnInit, ViewChild } from '@angular/core';
import { Roles } from '../../../models/roles';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RolesService } from '../../../services/roles.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-listarroles',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterLink,
    MatCardModule,
  ],
  templateUrl: './listarroles.component.html',
  styleUrl: './listarroles.component.css',
})
export class ListarrolesComponent implements OnInit {
  dataSource: MatTableDataSource<Roles> = new MatTableDataSource();
  displayedColumns: string[] = ['codigo', 'nombre', 'editar', 'eliminar'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rS: RolesService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.rS.getList().subscribe((data) => {
      this.dataSource.data = data;
    });
    this.rS.list().subscribe((data) => {
      this.rS.setList(data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  eliminar(id: number) {
    this.rS.deleteR(id).subscribe({
      next: () => {
        // Si se eliminó con éxito, actualiza la lista
        this.rS.list().subscribe((data) => {
          this.rS.setList(data);
          this.dataSource.data = data;
          this.snackBar.open('Se eliminó correctamente', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        });
      },
      error: (err) => {
        // Solo en el frontend, sin saber exactamente qué pasó en el back
        let mensaje = 'No se pudo eliminar el rol.';

        // Puedes refinar este mensaje si el backend te da algo en el cuerpo
        if (
          err.status === 500 || // genérico
          err.status === 400 || // bad request
          (typeof err.error === 'string' && err.error.includes('Constraint')) || // mensaje de texto con pista
          (err.error?.message && err.error.message.includes('constraint'))
        ) {
          mensaje = 'No es posible eliminar el rol porque está en uso.';
        }

        this.snackBar.open(mensaje, 'Cerrar', {
          duration: 4000,
          verticalPosition: 'top',
        });
      },
    });
  }
}
