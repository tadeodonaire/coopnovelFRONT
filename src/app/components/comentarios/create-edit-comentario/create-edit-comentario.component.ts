import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comentario } from '../../../models/comentario';
import { Usuario } from '../../../models/usuarios';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComentarioService } from '../../../services/comentario.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { CapituloService } from '../../../services/capitulo.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Capitulos } from '../../../models/capitulos';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-create-edit-comentario',
  imports: [MatTableModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-edit-comentario.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './create-edit-comentario.component.css'
})
export class CreateEditComentarioComponent {
  form: FormGroup = new FormGroup({});
  comentarios: Comentario = new Comentario();
  status: boolean = true;

  logged: string = '';
  user: Usuario = new Usuario();

  actualDate: string = new Date().toLocaleDateString('en-CA'); // Formato YYYY-MM-DD

  listaUsuarios: Usuario[] = [];
  listaCapitulos: Capitulos[] = [];

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
    private comS: ComentarioService,
    private uS: UsuariosService,
    private capS: CapituloService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // ✅ AGREGAR esta variable
  capituloPreseleccionado: Capitulos | null = null;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;

      // ✅ Capturar y manejar capituloId directamente
      const capituloId = data['capituloId'];
      if (capituloId) {
        this.capS.listId(Number(capituloId)).subscribe(capitulo => {
          this.capituloPreseleccionado = capitulo; // ✅ AGREGAR esta línea

          // Actualizar formulario con el capítulo seleccionado
          this.form.patchValue({
            capitulo: Number(capituloId)
          });
          console.log('Capítulo preseleccionado:', capitulo.capTitulo);
        });
      }

      //actualizar trae data
      this.init();

    });

    this.form = this.formBuilder.group({
      codigo: [''],
      contenido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/), Validators.minLength(3), Validators.maxLength(500)]],
      fecha: [this.actualDate],
      usuario: [this.user.username],
      capitulo: ['', Validators.required],
    });

    let username = this.loginService.getUsername();
    console.log(username);

    if (username) {
      // ✅ Obtener todos los usuarios y buscar por username
      this.uS.list().subscribe(usuarios => {
        const userFound = usuarios.find(user => user.username === username);
        if (userFound) {
          console.log('Usuario encontrado:', userFound['username']);
          this.user = userFound;
          console.log(this.user.username);

          // ✅ Actualizar el formulario con el usuario encontrado
          this.form.patchValue({
            usuario: this.user.username
          });
        }
      });
    }
    this.capS.list().subscribe(data => {
      this.listaCapitulos = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.comentarios.idComentario = this.form.value.codigo;
      this.comentarios.comContenido = this.form.value.contenido;
      this.comentarios.comFecha = this.form.value.fecha;
      this.comentarios.usuario.idUsuario = this.user.idUsuario;
      this.comentarios.capitulo.idCapitulo = this.form.value.capitulo;

      if (this.edicion) {
        //actualizar
        this.comS.update(this.comentarios).subscribe(() => {
          this.comS.list().subscribe((data) => {
            this.comS.setList(data);
          });
        });
      } else {
        //insertar
        this.comS.insert(this.comentarios).subscribe(() => {
          this.comS.list().subscribe((data) => {
            this.comS.setList(data);
          });
        });
      }
    }
    this.router.navigate(['comentario']);
  }

  cancelar() {
    this.router.navigate(['comentario']);
  }

  init() {
    if (this.edicion) {
      this.comS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idComentario),
          contenido: new FormControl(data.comContenido),
          fecha: new FormControl(data.comFecha),
          usuario: new FormControl(data.usuario.usNombre),
          capitulo: new FormControl(data.capitulo.idCapitulo, Validators.required),
        });
      });
    }
  }
}
