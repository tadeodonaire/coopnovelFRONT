import { Component } from '@angular/core';
import { EdadComponent } from "./edad/edad.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reportes',
  imports: [RouterOutlet,EdadComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  constructor(public route: ActivatedRoute) { }
}
