import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Descargas } from '../../../models/descargas';
import { DescargaService } from '../../../services/descarga.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuarios';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-creareditardescargas',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,CommonModule
  ],
  templateUrl: './creareditardescargas.component.html',
  styleUrl: './creareditardescargas.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CreareditardescargasComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  descargas: Descargas = new Descargas();
  id: number = 0;
  edicion: boolean = false;

  listaUsuarios: Usuario[] = [];

  constructor(
    private dS: DescargaService,
    private uS: UsuariosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snacbar: MatSnackBar, //snacbar
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      //actualizar trae data
      this.init();
    });

    this.form = this.formBuilder.group({
      idDescarga: [''],
      hisFecha: ['', [Validators.required, this.fechaMinimaValidator()]],
      UserId: ['', Validators.required],
    });
    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });
  }

  fechaMinimaValidator(): ValidatorFn {
    return (PLcontrol: AbstractControl): ValidationErrors | null => {
      const PLvalor = PLcontrol.value;
      if (!PLvalor) return null;

      const PLhoy = new Date();
      PLhoy.setHours(0, 0, 0, 0);

      const PLfechaIngresada = new Date(PLvalor);
      PLfechaIngresada.setHours(0, 0, 0, 0);

      return PLfechaIngresada < PLhoy ? null : { PLfechaInvalida: true };
    };
  }

  aceptar() {
    if (this.form.valid) {
      const formValues = this.form.value;
      this.descargas.idDescarga = this.form.value.idDescarga;

      const date: Date = new Date(formValues.hisFecha);
      this.descargas.hisFecha = this.form.value.hisFecha;

      this.descargas.user.idUsuario = this.form.value.UserId;

      console.log('Se enviará:', this.descargas);

      if (this.edicion) {
        //actualizar
        this.dS.update(this.descargas).subscribe(() => {
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
          });
        });
        this.snacbar.open('Actualizacion con éxito', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
        this.router.navigate(['descargas']);
      } else {
        //insertar
        this.dS.insert(this.descargas).subscribe(() => {
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
          });
        });

        this.snacbar.open('registrado con éxito', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
        this.form.reset();
      }
    }
  }

  cancelar() {
    this.router.navigate(['descargas']);
  }

  init() {
    if (this.edicion) {
      this.dS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idDescarga: new FormControl(data.idDescarga),
          hisFecha: new FormControl(data.hisFecha),
          UserId: new FormControl(data.user.idUsuario),
        });
      });
    }
  }
}
