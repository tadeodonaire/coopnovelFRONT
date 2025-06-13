import { Component } from '@angular/core';
import { ActivatedRoute,RouterOutlet } from '@angular/router';
import { ListarBibliotecasComponent } from './listar-bibliotecas/listar-bibliotecas.component';

@Component({
  selector: 'app-biblioteca',
  imports: [RouterOutlet,ListarBibliotecasComponent],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.css'
})
export class BibliotecaComponent {
constructor(public route:ActivatedRoute) {}
}
