import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarnovelaComponent } from './listarnovela/listarnovela.component';

@Component({
  selector: 'app-novela',
  imports: [RouterOutlet, ListarnovelaComponent],
  templateUrl: './novela.component.html',
  styleUrl: './novela.component.css'
})
export class NovelaComponent {
  constructor(public route:ActivatedRoute){}
}
