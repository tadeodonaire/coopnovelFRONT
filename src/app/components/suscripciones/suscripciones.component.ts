import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarsuscripcionesComponent } from "./listarsuscripciones/listarsuscripciones.component";

@Component({
  selector: 'app-suscripciones',
  imports: [RouterOutlet, ListarsuscripcionesComponent],
  templateUrl: './suscripciones.component.html',
  styleUrl: './suscripciones.component.css'
})
export class SuscripcionesComponent {
  constructor(public route: ActivatedRoute) {}
}
