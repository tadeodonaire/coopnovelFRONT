import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormBuilder,
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
import { Usuario } from '../../../models/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Roles } from '../../../models/roles';
import { RolesService } from '../../../services/roles.service';
import { LoginService } from '../../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  providers: [provideNativeDateAdapter()],
  selector: 'app-creaeditarusuarios',
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
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './creaeditarusuarios.component.html',
  styleUrl: './creaeditarusuarios.component.css',
})
export class CreaeditarusuariosComponent {
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();
  listarRol: Roles[] = [];
  hidePassword: boolean = true;
  estado: Boolean = false;
  id: number = 0;
  edicion: boolean = false;
  maxFecha: string = '';
  minFecha: string = '';
  esAdmin: boolean = false;
  estaLogueado: boolean = false;

  constructor(
    private uS: UsuariosService,
    private loginService: LoginService,
    private rS: RolesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const hoy = new Date();
    const maxFechaDate = new Date(
      hoy.getFullYear() - 5,
      hoy.getMonth(),
      hoy.getDate()
    );
    this.maxFecha = maxFechaDate.toISOString().split('T')[0];
    this.minFecha = '1900-01-01'; // o ajusta según tu app
    // Determina si el usuario actual está logueado y si es admin
    const rol = this.loginService.showRole();
    this.esAdmin = rol === 'ADMINISTRADOR';
    this.estaLogueado = this.loginService.verificar();

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = this.id != null;

      this.form = this.formBuilder.group({
        codigo: [''],
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        fecha: ['', Validators.required],
        usuario: ['', Validators.required],
        contrasena: [
          '',
          this.edicion ? [] : [Validators.required, Validators.minLength(5)],
        ],
        estado: [
          this.edicion ? '' : true,
          this.edicion ? Validators.required : [],
        ],
        email: ['', [Validators.required, Validators.email]],
        rol: ['', [Validators.required]],
      });

      this.rS.list().subscribe((data) => {
        this.listarRol = data;
      });

      this.init();
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.usuario.idUsuario = this.form.value.codigo;
      this.usuario.usNombre = this.form.value.nombre;
      this.usuario.usApellido = this.form.value.apellido;
      this.usuario.usFecNacimiento = this.form.value.fecha;
      this.usuario.usCorreo = this.form.value.email;
      this.usuario.username = this.form.value.usuario;
      this.usuario.password = this.form.value.contrasena;
      this.usuario.usEnable = this.edicion ? this.form.value.estado : true;
      this.usuario.role.id = this.form.value.rol;
      if (this.edicion) {
        this.uS.update(this.usuario).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
            this.router.navigate(['usuarios']);
          });
        });
      } else {
        this.uS.insert(this.usuario).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);

            if (!this.estaLogueado) {
              this.snackBar.open(
                '🎉 Usuario registrado exitosamente 😊',
                'Cerrar',
                {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                }
              );
              this.router.navigate(['login']);
            } else {
              this.router.navigate(['usuarios']);
            }
          });
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data) => {
        this.usuario = data;
        this.form.patchValue({
          codigo: data.idUsuario,
          nombre: data.usNombre,
          apellido: data.usApellido,
          email: data.usCorreo,
          fecha: data.usFecNacimiento,
          usuario: data.username,
          contrasena: data.password,
          estado: data.usEnable,
          rol: data.role.id,
        });
      });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
