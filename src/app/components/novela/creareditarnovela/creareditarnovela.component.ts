import { Component, OnInit } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Proyecto } from '../../../models/proyecto';
import { Novela } from '../../../models/novela';
import { NovelaService } from '../../../services/novela.service';
import { ProyectoService } from '../../../services/proyecto.service';

@Component({
  selector: 'app-creareditarnovela',
  imports: [
    MatInputModule,
    MatFormField,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './creareditarnovela.component.html',
  styleUrl: './creareditarnovela.component.css',
})
export class CreareditarnovelaComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  listaProyectos: Proyecto[] = [];
  nove: Novela = new Novela();

  id: number = 0;
  edicion: boolean = false;
  proyectoId: number | null = null; 

  constructor(
    private formBuilder: FormBuilder,
    private pS: ProyectoService,
    private nS: NovelaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.proyectoId = params['proyectoId'];
      console.log('Proyecto ID capturado:', this.proyectoId); 
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      hcodigo: [''],
      htitulo: ['', Validators.required],
      hresumen: ['', Validators.required],
      hgenero: ['', Validators.required],
      hproyecto: [''],
    });

    // Cargar los proyectos
    this.pS.list().subscribe((data) => {
      this.listaProyectos = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.nove.idNovela = this.form.value.hcodigo;
      this.nove.novTitulo = this.form.value.htitulo;
      this.nove.novResumen = this.form.value.hresumen;
      this.nove.novGenero = this.form.value.hgenero;

      if (!this.edicion && this.proyectoId) {
        this.nove.proyectos.idProyecto = this.proyectoId;
      } else {
        this.nove.proyectos.idProyecto = this.form.value.hproyecto;
      }

      if (this.edicion) {
        this.nS.update(this.nove).subscribe((data) => {
          this.nS.list().subscribe((data) => {
            this.nS.setList(data);
          });
        });
      } else {
        this.nS.insert(this.nove).subscribe((data) => {
          this.nS.list().subscribe((data) => {
            this.nS.setList(data);
          });
        });
      }
    }
    this.router.navigate(['novela']);
  }

  init() {
    if (this.edicion) {
      this.nS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idNovela),
          htitulo: new FormControl(data.novTitulo),
          hresumen: new FormControl(data.novResumen),
          hgenero: new FormControl(data.novGenero),
          hproyecto: new FormControl(data.proyectos.idProyecto),
        });
      });
    }

    if (this.proyectoId) {
      if (!this.edicion) {
        this.form.patchValue({
          hproyecto: this.proyectoId,
        });
        console.log('Proyecto ID asignado al campo:', this.proyectoId);
      }
    }
  }
}
