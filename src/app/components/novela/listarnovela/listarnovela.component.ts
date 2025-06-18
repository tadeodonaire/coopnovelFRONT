import { Component, OnInit } from '@angular/core';
import { Novela } from '../../../models/novela';
import { NovelaService } from '../../../services/novela.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listarnovela',
  imports: [MatTableModule, CommonModule,MatButtonModule,RouterLink, MatIconModule],
  templateUrl: './listarnovela.component.html',
  styleUrl: './listarnovela.component.css'
})
export class ListarnovelaComponent implements OnInit{
  dataSource:MatTableDataSource<Novela>=new MatTableDataSource();
  displayedColumns:string[]=["c1","c2","c3","c4","c5","c6", "c7"];

  constructor(private nS:NovelaService){}

  ngOnInit(): void {
    this.nS.list().subscribe((data=>{
      this.dataSource=new MatTableDataSource(data);
    }));
    this.nS.getList().subscribe((data=>{
      this.dataSource=new MatTableDataSource(data);
    }));
  }

  eliminar(id:number){
    this.nS.deleteN(id).subscribe((data)=>{
      this.nS.list().subscribe((data)=>{
        this.nS.setList(data);
      });
    });
  }
}
