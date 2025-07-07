import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CapitulosSinCorreccionIADTO } from '../../../models/capitulos-sin-correccion-iadto';
import { CorreccionIAService } from '../../../services/correccion-ia.service';

@Component({
  selector: 'app-capitulos-sin-correccion-ia',
  imports: [
    MatTableModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './capitulos-sin-correccion-ia.component.html',
  styleUrl: './capitulos-sin-correccion-ia.component.css',
})
export class CapitulosSinCorreccionIAComponent implements OnInit{
  dataSource: MatTableDataSource<CapitulosSinCorreccionIADTO> = new MatTableDataSource<CapitulosSinCorreccionIADTO>();
  displayerColumns: string[] = ['idCapitulo', 'capTitulo'];

  constructor(private cS: CorreccionIAService){}

  ngOnInit(): void {
      this.cS.getCapSinCorrecciones().subscribe(data=>{
        this.dataSource = new MatTableDataSource(data);
      });
  }
}
