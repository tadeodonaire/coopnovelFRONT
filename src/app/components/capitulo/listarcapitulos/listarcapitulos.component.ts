import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { Capitulos } from '../../../models/capitulos';
import { CapituloService } from '../../../services/capitulo.service';

@Component({
  selector: 'app-listarcapitulos',
  imports: [CommonModule,MatTableModule,RouterModule,MatIconModule, MatButtonModule],
  templateUrl: './listarcapitulos.component.html',
  styleUrl: './listarcapitulos.component.css'
})
export class ListarcapitulosComponent {
  dataSource:MatTableDataSource<Capitulos>=new MatTableDataSource()
  displayedColumns:string[]=["novela","titulo","contenido","descarga","id","editar", "eliminar"]

  constructor(private cS:CapituloService) {}

  ngOnInit(): void {
    this.cS.list().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data)
    })
    this.cS.getList().subscribe(data=>{
      this.dataSource=new MatTableDataSource(data)
    })
  }

  eliminar(id:number){
    this.cS.deleteC(id).subscribe((data)=>{
      this.cS.list().subscribe((data)=>{
        this.cS.setList(data);
      });
    });
  }
}
