import { Component } from '@angular/core';
import { ListardescargasComponent } from "./listardescargas/listardescargas.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-descargas',
  imports: [ListardescargasComponent,RouterOutlet],
  templateUrl: './descargas.component.html',
  styleUrl: './descargas.component.css'
})
export class DescargasComponent {
constructor(public route:ActivatedRoute){}
}
