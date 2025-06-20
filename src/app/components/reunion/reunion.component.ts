import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarReunionComponent } from "./listar-reunion/listar-reunion.component";

@Component({
  selector: 'app-reunion',
  imports: [RouterOutlet, ListarReunionComponent],
  templateUrl: './reunion.component.html',
  styleUrl: './reunion.component.css'
})
export class ReunionComponent {
  constructor(public route:ActivatedRoute) { }
}
