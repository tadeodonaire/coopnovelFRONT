import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarComentariosComponent } from './listar-comentarios/listar-comentarios.component';

@Component({
  selector: 'app-comentarios',
  imports: [RouterOutlet, ListarComentariosComponent],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  constructor(public route: ActivatedRoute) { }
}
