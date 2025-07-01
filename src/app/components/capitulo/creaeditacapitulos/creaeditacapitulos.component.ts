import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Capitulos } from '../../../models/capitulos';
import { Novela } from '../../../models/novela';
import { Descargas } from '../../../models/descargas';
import { CapituloService } from '../../../services/capitulo.service';
import { NovelaService } from '../../../services/novela.service';
import { DescargaService } from '../../../services/descarga.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-creaeditacapitulos',
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './creaeditacapitulos.component.html',
  styleUrl: './creaeditacapitulos.component.css',
})
export class CreaeditacapitulosComponent  implements OnInit{
  form: FormGroup = new FormGroup({});
  listaNovelas: Novela[] = [];
  listaDescargas: Descargas[] = [];
  capitulo: Capitulos = new Capitulos();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cS: CapituloService,
    private nS: NovelaService,
    private dS: DescargaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      id: [''],
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      novelas: ['', Validators.required],
      descargas: ['', Validators.required],
    });

    this.nS.list().subscribe((data) => {
      this.listaNovelas = data;
    });
    this.dS.list().subscribe((data) => {
      this.listaDescargas = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.capitulo.idCapitulo = this.form.value.id;
      this.capitulo.capTitulo = this.form.value.titulo;
      this.capitulo.capContenido = this.form.value.contenido;
      this.capitulo.descargas.idDescarga = this.form.value.descargas;
      this.capitulo.novelas.idNovela = this.form.value.novelas;

      console.log(this.form.value);

      if (this.edicion) {
        this.cS.update(this.capitulo).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      } else {
        this.cS.insert(this.capitulo).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
    }
    this.router.navigate(['capitulo']);
  }

  init() {
    if (this.edicion) {
      this.cS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.idCapitulo),
          titulo: new FormControl(data.capTitulo),
          contenido: new FormControl(data.capContenido),
          descargas: new FormControl(data.descargas.idDescarga),
          novelas: new FormControl(data.novelas.idNovela),
        });
      });
    }
  }
}
