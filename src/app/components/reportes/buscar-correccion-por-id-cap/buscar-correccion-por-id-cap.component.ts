import { Component } from '@angular/core';
import { ListarCorreccionPorIdCapDTO } from '../../../models/listar-correccion-por-id-cap-dto';
import { CorreccionIAService } from '../../../services/correccion-ia.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-buscar-correccion-por-id-cap',
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinner
  ],
  templateUrl: './buscar-correccion-por-id-cap.component.html',
  styleUrl: './buscar-correccion-por-id-cap.component.css',
})
export class BuscarCorreccionPorIdCapComponent {
  idCap: number = 0;
  resultado: ListarCorreccionPorIdCapDTO | null = null;
  cargando: boolean = false;

  constructor(private cS: CorreccionIAService, private snackBar: MatSnackBar) {}
  
  buscarCorreccion(){
    if(!this.idCap){
      this.snackBar.open('El id del capitulo no es valido', 'Cerrar', {duration: 3000,});
        return;
    }

    this.cargando=true;
    this.resultado = null;

    this.cS.getCorreccionPorIdCapitulo(this.idCap).subscribe((data)=>{
      this.cargando= false;
      if(data.length === 0){
        this.snackBar.open('El capitulo seleccionado no tiene una correccion', 'Cerrar', {duration: 3000,});
      } else {
        this.resultado = data[0]; 
      }
    })

    error:()=>{
      this.cargando = false;
      this.snackBar.open('Error al buscar la correccion', 'Cerrar',{duration:3000});
    }
  }
}
