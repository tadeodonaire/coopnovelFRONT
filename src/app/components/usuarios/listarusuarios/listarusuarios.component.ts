import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuarios';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listarusuarios',
  imports: [CommonModule,MatTableModule,RouterModule,MatIconModule, MatButtonModule,RouterLink],
  templateUrl: './listarusuarios.component.html',
  styleUrl: './listarusuarios.component.css'
})
export class ListarusuariosComponent implements OnInit{
  dataSource:MatTableDataSource<Usuario>=new MatTableDataSource()
  displayedColumns:string[]=["id","nombre","apellido","birthday","correo","usuario","estado","editar","eliminar"]

  constructor(private uS:UsuariosService) {}

  ngOnInit(): void {
    this.uS.list().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data)
    })
    this.uS.getList().subscribe(data=>{
      this.dataSource=new MatTableDataSource(data)
    })
  }

  eliminar(id:number){
    this.uS.deleteU(id).subscribe((data)=>{
      this.uS.list().subscribe((data)=>{
        this.uS.setList(data);
      });
    });
  }

}
