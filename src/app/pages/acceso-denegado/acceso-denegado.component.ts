import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  imports: [RouterLink,MatButtonModule],
  templateUrl: './acceso-denegado.component.html',
  styleUrl: './acceso-denegado.component.css'
})
export class AccesoDenegadoComponent {

}
