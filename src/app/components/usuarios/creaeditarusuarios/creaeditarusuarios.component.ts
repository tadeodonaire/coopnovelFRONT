import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Usuario } from '../../../models/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import { provideNativeDateAdapter} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  providers: [provideNativeDateAdapter()],
  selector: 'app-creaeditarusuarios',
  imports: [MatInputModule,MatIconModule,FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatRadioModule, MatSelectModule, MatDatepickerModule, MatSelectModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './creaeditarusuarios.component.html',
  styleUrl: './creaeditarusuarios.component.css'
})
export class CreaeditarusuariosComponent {
  form: FormGroup = new FormGroup({})
  usuario: Usuario = new Usuario();
  status: Boolean = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  hidePassword: boolean = true;
  estado: Boolean = false;

  clickEvent(event: MouseEvent) {
    this.hidePassword = !this.hidePassword;
    event.stopPropagation();
  }

    constructor(private uS:UsuariosService,
                private formBuilder:FormBuilder,
                private router:Router
    ) {}

    ngOnInit() {
      this.form = this.formBuilder.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        fecha: ['', Validators.required],
        usuario: ['', Validators.required],
        contrasena: ['', Validators.required],
        estado: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      });
    }




    aceptar() {
  if (this.form.valid) {
    this.usuario.usNombre = this.form.value.nombre;
    this.usuario.usApellido = this.form.value.apellido;
    this.usuario.usFecNacimiento = this.form.value.fecha;
    this.usuario.usCorreo = this.form.value.email;
    this.usuario.username = this.form.value.usuario;
    this.usuario.password = this.form.value.contrasena;
    this.usuario.usEnable = this.form.value.estado;

    this.uS.insert(this.usuario).subscribe(() => {
      this.uS.list().subscribe(data => {
        this.uS.setList(data);
      });
      this.router.navigate(['/usuarios']);
    });
  } else {
    this.form.markAllAsTouched();
  }
}

togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
