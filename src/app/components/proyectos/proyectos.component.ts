import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarproyectosComponent } from './listarproyectos/listarproyectos.component';

@Component({
  selector: 'app-proyectos',
  imports: [RouterOutlet,ListarproyectosComponent],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.css'
})
export class ProyectosComponent {
  constructor(public route:ActivatedRoute) {}
}
