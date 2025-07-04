import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarcorreccionesIAComponent } from "./listarcorrecciones-ia/listarcorrecciones-ia.component";

@Component({
  selector: 'app-correccion-ia',
  imports: [RouterOutlet, ListarcorreccionesIAComponent],
  templateUrl: './correccion-ia.component.html',
  styleUrl: './correccion-ia.component.css'
})
export class CorreccionIAComponent {
  constructor(public route: ActivatedRoute) { }
}
  