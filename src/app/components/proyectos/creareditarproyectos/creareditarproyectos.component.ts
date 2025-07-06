import { Component, OnInit } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Usuario } from '../../../models/usuarios';
import { Proyecto } from '../../../models/proyecto';
import { ProyectoService } from '../../../services/proyecto.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-creareditarproyectos',
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './creareditarproyectos.component.html',
  styleUrl: './creareditarproyectos.component.css',
})
export class CreareditarproyectosComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  listaUsuarios: Usuario[] = [];
  proye: Proyecto = new Proyecto();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private pS: ProyectoService,
    private router: Router,
    private route: ActivatedRoute,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.proye.usario = { idUsuario: 0 } as Usuario;
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      //actualizar trae data
      this.init();
    });

    this.form = this.formBuilder.group({
      hcodigo: [''],
      htitulo: ['', Validators.required],
      hdescripcion: ['', Validators.required],
    });
  }

  aceptar() {
    console.log('Formulario inválido:', this.form.invalid); // Verifica si el formulario está inválido
    console.log('Estado del formulario:', this.form);

    Object.values(this.form.controls).forEach(control => {
    console.log('Estado de cada campo:', control.valid, control.errors); // Verifica el estado de cada campo
    control.markAsTouched();  // Asegúrate de que todos los controles sean tocados
    control.updateValueAndValidity(); // Actualiza las validaciones de los controles
    });
    if (this.form.valid) {
      this.proye.idProyecto = this.form.value.hcodigo;
      this.proye.proyTitulo = this.form.value.htitulo;
      this.proye.proyDescripcion = this.form.value.hdescripcion;
      // Asignar el usuario autenticado
      const username = this.loginService.getUserId();
      if (username) {
        // Asignar el username al campo username del usuario
        this.proye.usario = new Usuario();
        this.proye.usario.username = username;
      } else {
        console.error('No se encontró usuario autenticado.');
        return;
      }

      if (this.edicion) {
        this.pS.update(this.proye).subscribe((data) => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data);
            this.router.navigate(['proyecto']);
          });
        });
      } else {
        this.pS.insert(this.proye).subscribe((data) => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data);
            this.router.navigate(['proyecto']);
          });
        });
      }
    } else {
      console.error('Formulario inválido, no se puede registrar el proyecto');
    }
  }

  init() {
    if (this.edicion) {
      this.pS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idProyecto),
          htitulo: new FormControl(data.proyTitulo, Validators.required),
          hdescripcion: new FormControl(data.proyDescripcion, Validators.required),
        });
      });
    }
  }
}
