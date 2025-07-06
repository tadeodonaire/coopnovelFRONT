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
import { MatInputModule, MatFormField } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CorreccionIAService } from '../../../services/correccion-ia.service';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { CapituloService } from '../../../services/capitulo.service';
import { Capitulos } from '../../../models/capitulos';
import { CorreccionesIA } from '../../../models/correccionesIA';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-creareditarcorrecciones-ia',
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './creareditarcorrecciones-ia.component.html',
  styleUrl: './creareditarcorrecciones-ia.component.css',
})
export class CreareditarcorreccionesIAComponent implements OnInit {
  cargandoIA: boolean = false;
  form!: FormGroup; // Usamos el operador de exclamación para indicar que se inicializa más tarde
  listaCapitulos: Capitulos[] = [];
  idCapitulo: number | null = null;
  correccionIA: CorreccionesIA = new CorreccionesIA();
  edicion: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cS: CapituloService,
    private coS: CorreccionIAService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario primero
    this.form = this.formBuilder.group({
      correccionIA: ['', [Validators.required]],
      capitulos: [{ value: '', disabled: true }, [Validators.required]],
    });

    // Luego, obtenemos los parámetros y procedemos con la inicialización
    this.route.params.subscribe((data: Params) => {
      this.idCapitulo = data['id']; // Obtener idCapitulo de la URL
      this.edicion = this.idCapitulo != null;
      this.init(); // Inicializamos el formulario con la información del capítulo
    });

    // Obtener los capítulos para mostrarlos en el selector
    this.cS.list().subscribe((data) => {
      this.listaCapitulos = data;
    });
  }

  init() {
    if (this.edicion && this.idCapitulo) {
      // Solo manipulamos el formulario si está completamente inicializado
      if (this.form) {
        this.form.get('capitulos')?.setValue(this.idCapitulo);
      }
      
      // Llamamos al servicio para obtener el contenido del capítulo
      this.cS.listId(this.idCapitulo).subscribe((capitulo) => {
        if (capitulo) {
          this.generarCorreccionIA(capitulo.capContenido);
        }
      });
    }
  }

  generarCorreccionIA(textoCapitulo: string) {
    this.cargandoIA = true;

    // Llamamos al servicio de Corrección IA
    this.coS.generarCorreccionIA(textoCapitulo).subscribe({
      next: (response) => {
        const respuestaTexto =
          response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        this.form.get('correccionIA')?.setValue(respuestaTexto);
        this.cargandoIA = false;
      },
      error: (err) => {
        console.error('Error IA:', err);
        this.snackBar.open('Error al generar corrección IA 😢', 'Cerrar', {
          duration: 3000,
        });
        this.cargandoIA = false;
      },
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.correccionIA.corCorreccionIA = this.form.value.correccionIA;
      this.correccionIA.capitulos.idCapitulo = this.form.value.capitulos;

      console.log('Se enviará:', this.correccionIA);

      // Verificamos si el capítulo ya existe en la base de datos
      this.cS.listId(this.correccionIA.capitulos.idCapitulo).subscribe((capitulo) => {
        if (capitulo) {
          this.correccionIA.capitulos = capitulo;

          if (this.edicion) {
            // Actualizar la corrección IA
            this.coS.update(this.correccionIA).subscribe(() => {
              this.snackBar.open('Corrección actualizada correctamente', 'Cerrar', { duration: 3000 });
              this.router.navigate(['correccionIA']);
            });
          } else {
            // Insertar una nueva corrección IA
            this.coS.insert(this.correccionIA).subscribe(() => {
              this.snackBar.open('Corrección guardada correctamente', 'Cerrar', { duration: 3000 });
              this.router.navigate(['correccionIA']);
            });
          }
        } else {
          this.snackBar.open('El capítulo no existe en la base de datos', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}