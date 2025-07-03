import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Roles } from '../../../models/roles';
import { RolesService } from '../../../services/roles.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-creaeditaroles',
  imports: [MatFormFieldModule,CommonModule,MatInputModule,ReactiveFormsModule,MatButtonModule,MatButtonModule],
  templateUrl: './creaeditaroles.component.html',
  styleUrl: './creaeditaroles.component.css',
})
export class CreaeditarolesComponent {
  form: FormGroup = new FormGroup({});
  rol: Roles = new Roles();
  id: number = 0;
  edicion: boolean = false;
  constructor(
    private rS: RolesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = this.id != null;
      this.form = this.formBuilder.group({
        codigo: [''],
        nombre: ['', Validators.required],
      });
      this.init();
    });
  }
  aceptar() {
    if (this.form.valid) {
      this.rol.id = this.form.value.codigo;
      this.rol.rol = this.form.value.nombre;
      if (this.edicion) {
        this.rS.update(this.rol).subscribe(() => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      } else {
        this.rS.insert(this.rol).subscribe(() => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      }
    }
    this.router.navigate(['roles']);
  }
  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.rol = data;
        this.form.patchValue({
          codigo: data.id,
          nombre: data.rol,
        });
      });
    }
  }
}
