import {Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Biblioteca } from '../../../models/biblioteca';
import { BibliotecaService } from '../../../services/biblioteca.service';

@Component({
  providers: [provideNativeDateAdapter()],
  selector: 'app-crear-editar-biblioteca',
  imports: [
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './crear-editar-biblioteca.component.html',
  styleUrl: './crear-editar-biblioteca.component.css',
})
export class CrearEditarBibliotecaComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  biblioteca: Biblioteca = new Biblioteca();

  id: number = 0;
  edicion: boolean = false;

  constructor(
    private bS: BibliotecaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      //actualizar.traer data
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo:[''],
      nombre: ['', Validators.required],
    });
  }
  aceptar() {
    if (this.form.valid) {
      this.biblioteca.idBiblioteca=this.form.value.codigo;
      this.biblioteca.bibNombre = this.form.value.nombre;

      if (this.edicion) {
        this.bS.modificifar(this.biblioteca).subscribe(() => {
          this.bS.list().subscribe((data) => {
            this.bS.setList(data);
          });
        });
      } else {
        this.bS.insert(this.biblioteca).subscribe(() => {
          this.bS.list().subscribe((data) => {
            this.bS.setList(data);
          });
        });
      }
    }

    this.router.navigate(['biblioteca']);
  }

  init() {
    if (this.edicion) {
      this.bS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo:new FormControl(data.idBiblioteca),
          nombre:new FormControl(data.bibNombre),
        });
      });
    }
  }
}
