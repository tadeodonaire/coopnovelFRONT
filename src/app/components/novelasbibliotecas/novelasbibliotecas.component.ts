import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarnovelasbibliotecasComponent } from "./listarnovelasbibliotecas/listarnovelasbibliotecas.component";

@Component({
  selector: 'app-novelasbibliotecas',
  imports: [ListarnovelasbibliotecasComponent, RouterOutlet],
  templateUrl: './novelasbibliotecas.component.html',
  styleUrl: './novelasbibliotecas.component.css'
})
export class NovelasbibliotecasComponent {
  constructor(public route:ActivatedRoute) {}
}
