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
    private uS: UsuariosService,
    private router: Router,
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
      hcodigo: [''],
      htitulo: ['', Validators.required],
      hdescripcion: ['', Validators.required],
      husuarios: ['', Validators.required],
    });
    this.uS.list().subscribe((data=>{
      this.listaUsuarios = data;
    }))
  }

  aceptar() {
    if (this.form.valid) {
      this.proye.idProyecto = this.form.value.hcodigo;
      this.proye.proyTitulo = this.form.value.htitulo;
      this.proye.proyDescripcion = this.form.value.hdescripcion;
      this.proye.usario = this.form.value.husuarios;
      if (this.edicion) {
        this.pS.update(this.proye).subscribe((data) => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data);
          });
        });
      } else {
        this.pS.insert(this.proye).subscribe((data) => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data);
          });
        });
      }
    }
    this.router.navigate(['proyecto']);
  }

  init() {
    if (this.edicion) {
      this.pS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          hcodigo: new FormControl(data.idProyecto),
          htitulo: new FormControl(data.proyTitulo),
          hdescripcion: new FormControl(data.proyDescripcion),
          husuarios: new FormControl(data.usario),
        });
      });
    }
  }
}
