import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DescargaService } from '../../../services/descarga.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Descargas } from '../../../models/descargas';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listardescargas',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './listardescargas.component.html',
  styleUrl: './listardescargas.component.css',
})
export class ListardescargasComponent implements OnInit {
  dataSource: MatTableDataSource<Descargas> = new MatTableDataSource();
  displayedColumns = ['c1', 'c2', 'c3', 'c4'];

  form: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dS: DescargaService,
    private snacbar: MatSnackBar,
    private fb: FormBuilder,
    private loginService: LoginService
  ) {
    this.form = this.fb.group({
      parametro: [''],
    });
  }

  ngOnInit(): void {
    const rol = this.loginService.showRole();
    this.displayedColumns = ['c1', 'c2', 'c3'];

    if (this.isAdministrador()) {
      this.displayedColumns.push('c4'); // Solo si es admin
    }

    this.dS.getList().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
    this.dS.list().subscribe((data) => {
      this.dS.setList(data); // ← importante: actualiza el observable
    });

    this.dataSource.filterPredicate = (data, filter) => {
      const t = filter.trim().toLowerCase();
      return data.hisFecha.toString().toLowerCase().includes(t);
    };

    this.form.get('parametro')?.valueChanges.subscribe((value) => {
      this.applyFilter(value);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reiniciar al inicio de paginado
    }
  }

  eliminar(id: number) {
    this.dS.deleteN(id).subscribe((data) => {
      this.dS.list().subscribe((data) => {
        this.dS.setList(data);
      });
    });
    //snacbar aqui
    this.snacbar.open('Se eliminó correctamente', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
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
