import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EdadDTO } from '../../../models/edadDTO';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edad',
  imports: [MatTableModule,CommonModule,MatFormFieldModule,ReactiveFormsModule],
  templateUrl: './edad.component.html',
  styleUrl: './edad.component.css',
})
export class EdadComponent implements OnInit {
  dataSource: MatTableDataSource<EdadDTO> = new MatTableDataSource<EdadDTO>();
  displayedColumns: string[] = ['nombre', 'apellido', 'edad'];

  constructor(private uS: UsuariosService) {}

  ngOnInit(): void {
    this.uS.getEdad().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
}
