import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Reunion } from '../../../models/reuniones';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReunionService } from '../../../services/reunion.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuarios';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-create-edit-reunion',
  imports: [
    MatTableModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-edit-reunion.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './create-edit-reunion.component.css'
})
export class CreateEditReunionComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  reuniones: Reunion = new Reunion();
  status: boolean = true;

  listaUsuarios: Usuario[] = [];

  id: number = 0;
  edicion: boolean = false;

  //Snackbar
  private _snackBar = inject(MatSnackBar);
  message: string = 'Operación exitosa';
  action: string = 'Cerrar';

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  constructor(
    private rS: ReunionService,
    private uS: UsuariosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      //actualizar trae data
      this.init();
    });
    //
    this.form = this.formBuilder.group({
      codigo: [''],
      tema: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/), Validators.minLength(3)]],
      link: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern(/^(https?:\/\/)?[\w\-\.]+(\.[\w\-]+)+[/#?]?.*$/)]],
      fecha: ['', [Validators.required, this.fechaMinimaValidator()]],
      organizador: ['', Validators.required],
      participante: ['', Validators.required],
    });
    this.uS.list().subscribe(data => {
      this.listaUsuarios = data;
    })
  }

  fechaMinimaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) return null;

      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999); // Establecer al final del día

      const fechaIngresada = new Date(valor);

      // Solo permite fechas de hoy hacia adelante (SÍ fechas futuras)
      return fechaIngresada >= hoy ? null : { fechaFutura: true };
    };
  }

  aceptar() {
    if (this.form.valid) {
      this.reuniones.idReunion = this.form.value.codigo;
      this.reuniones.reuTema = this.form.value.tema;
      this.reuniones.reuLink = this.form.value.link;
      this.reuniones.reuFecha = this.form.value.fecha;
      this.reuniones.organizadorReu.idUsuario = this.form.value.organizador;
      this.reuniones.participanteReu.idUsuario = this.form.value.participante;

      if (this.edicion) {
        //actualizar
        this.rS.update(this.reuniones).subscribe(() => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      } else {
        //insertar
        this.rS.insert(this.reuniones).subscribe(() => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      }
    }
    this.router.navigate(['reunion']);
  }

  cancelar() {
    this.router.navigate(['reunion']);
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idReunion),
          tema: new FormControl(data.reuTema),
          link: new FormControl(data.reuLink),
          fecha: new FormControl(data.reuFecha),
          organizador: new FormControl(data.organizadorReu.idUsuario, Validators.required),
          participante: new FormControl(data.participanteReu.idUsuario, Validators.required),
        });
      });
    }
  }
}
