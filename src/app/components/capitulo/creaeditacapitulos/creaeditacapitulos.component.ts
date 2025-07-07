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
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-creaeditacapitulos',
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './creaeditacapitulos.component.html',
  styleUrl: './creaeditacapitulos.component.css',
})
export class CreaeditacapitulosComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  listaNovelas: Novela[] = [];
  capitulo: Capitulos = new Capitulos();
  novelaId: number | null = null; // Para almacenar el id de la novela
  novelaTitulo: string = ''; // Para almacenar el título de la novela
  novelaResumen: string = ''; // Para almacenar el resumen de la novela
  idCapitulo: number | null = null; // Para almacenar el id del capítulo que se está editando
  edicion: boolean = false; // Flag para saber si estamos en modo edición o no

  constructor(
    private formBuilder: FormBuilder,
    private cS: CapituloService,
    private nS: NovelaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la URL
    this.route.params.subscribe((params: Params) => {
      this.novelaId = params['novelaId']; // Obtener novelaId desde la URL
      this.idCapitulo = params['id']; // Obtener idCapitulo desde la URL

      this.edicion = this.idCapitulo != null; // Si el idCapitulo está presente, estamos en modo edición
      this.init();
    });

    // Definir el formulario
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required],  // Título del capítulo
      contenido: ['', Validators.required], // Contenido del capítulo
    });

    // Cargar las novelas disponibles
    this.nS.list().subscribe((data) => {
      this.listaNovelas = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      // Verificar si novelaId tiene un valor válido (no es null) y si tenemos idCapitulo
      if (this.novelaId !== null && this.idCapitulo !== null) {
        // Asignamos novelaId a la novela del capítulo solo si es válido
        this.capitulo.capTitulo = this.form.value.titulo;
        this.capitulo.capContenido = this.form.value.contenido;
        this.capitulo.novelas.idNovela = this.novelaId; // Asignar la novelaId

        if (this.edicion) {
          // Actualizar capítulo
          this.capitulo.idCapitulo = this.idCapitulo; // Asegurarse de que el idCapitulo se asigna
          this.cS.update(this.capitulo).subscribe(() => {
            this.cS.list().subscribe((data) => {
              this.cS.setList(data);
            });
          });
        } else {
          // Insertar nuevo capítulo
          this.cS.insert(this.capitulo).subscribe(() => {
            this.cS.list().subscribe((data) => {
              this.cS.setList(data);
            });
          });
        }
      } else {
        // Manejo de error si novelaId o idCapitulo son null
        console.error('Error: novelaId o idCapitulo es null');
      }
    }
    this.router.navigate(['novela']);
  }

  init() {
    if (this.novelaId) {
      // Si el id de la novela está presente en la URL, prellenamos el título y resumen
      const novela = this.listaNovelas.find(n => n.idNovela === this.novelaId);
      if (novela) {
        this.novelaTitulo = novela.novTitulo; // Asignamos el título de la novela
        this.novelaResumen = novela.novResumen; // Asignamos el resumen de la novela
      }
    }

    if (this.edicion && this.idCapitulo !== null) {
      // Si estamos en modo edición, obtener el capítulo con el idCapitulo
      this.cS.listId(this.idCapitulo).subscribe((data: Capitulos) => {
        this.capitulo = data; // Asignar los datos del capítulo al formulario
        this.form.setValue({
          titulo: this.capitulo.capTitulo,
          contenido: this.capitulo.capContenido,
        });
        // Asignar el idNovela al capítulo
        this.novelaId = this.capitulo.novelas.idNovela;
      });
    }
  }
}