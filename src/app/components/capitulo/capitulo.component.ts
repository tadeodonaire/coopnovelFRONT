import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarcapitulosComponent } from './listarcapitulos/listarcapitulos.component';

@Component({
  selector: 'app-capitulo',
  imports: [RouterOutlet,ListarcapitulosComponent],
  templateUrl: './capitulo.component.html',
  styleUrl: './capitulo.component.css'
})
export class CapituloComponent {
  constructor(public route: ActivatedRoute) { }
}
