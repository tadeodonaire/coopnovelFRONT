import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
import { Usuario } from '../../../models/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

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
    MatSelectModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './creaeditarusuarios.component.html',
  styleUrl: './creaeditarusuarios.component.css',
})
export class CreaeditarusuariosComponent {
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();
  hidePassword: boolean = true;
  estado: Boolean = false;
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private uS: UsuariosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fecha: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
      estado: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
      this.usuario.usEnable = this.form.value.estado;
      if (this.edicion) {
        this.uS.update(this.usuario).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
          });
        });
      } else {
        this.uS.insert(this.usuario).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
          });
        });
      }
    }
    this.router.navigate(['/usuarios']);
  }

  init(){
    if(this.edicion) {
      this.uS.listId(this.id).subscribe((data)=>{
        this.form = new FormGroup({
          codigo: new FormControl(data.idUsuario),
          nombre: new FormControl(data.usNombre),
          apellido: new FormControl(data.usApellido),
          email: new FormControl(data.usCorreo),
          fecha: new FormControl(data.usFecNacimiento),
          usuario: new FormControl(data.username),
          contrasena: new FormControl(data.password),
          estado: new FormControl(data.usEnable),
        });
      });
    }
  }
  

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
