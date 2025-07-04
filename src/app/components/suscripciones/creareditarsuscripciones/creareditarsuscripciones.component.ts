import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Usuario } from '../../../models/usuarios';
import { Suscripciones } from '../../../models/suscripciones';
import { SuscripcionesService } from '../../../services/suscripciones.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-creareditarsuscripciones',
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './creareditarsuscripciones.component.html',
  styleUrl: './creareditarsuscripciones.component.css'
})
export class CreareditarsuscripcionesComponent implements OnInit{
  form: FormGroup=new FormGroup({});
  listaUsuarios: Usuario[]=[];
  sus: Suscripciones = new Suscripciones();
  
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private sS: SuscripcionesService,
    private uS: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
      this.route.params.subscribe((data: Params)=>{
        this.id=data['id'];
        this.edicion=data['id'] != null;
        this.init();
      });

      this.form=this.formbuilder.group({
        idSuscripcion: [''],
        susFechaInicio: ['', [Validators.required]],
        suscriptor: ['', [Validators.required]],
        suscrito: ['', [Validators.required]]
      });
      this.uS.list().subscribe(data => {
        this.listaUsuarios = data;
      });
  }

  aceptar(){
    if(this.form.valid){
      this.sus.idSuscripcion=this.form.value.idSuscripcion;
      this.sus.susFechaInicio=this.form.value.susFechaInicio;
      this.sus.suscriptor.idUsuario=this.form.value.suscriptor;
      this.sus.suscrito.idUsuario=this.form.value.suscrito;

      if(this.edicion){
        this.sS.update(this.sus).subscribe(() => {
          this.sS.list().subscribe(data => {
            this.sS.setList(data);
          });
        });
      }else{
        this.sS.insert(this.sus).subscribe(() => {
          this.sS.list().subscribe(data => {
            this.sS.setList(data);
          });
        });
      }
    }
    this.router.navigate(['suscripciones']);
  }

  init(){
    if(this.edicion){
      this.sS.listId(this.id).subscribe((data)=>{
        this.form=new FormGroup({
          idSuscripcion: new FormControl(data.idSuscripcion),
          susFechaInicio: new FormControl(data.susFechaInicio),
          suscriptor: new FormControl(data.suscriptor.idUsuario),
          suscrito: new FormControl(data.suscrito.idUsuario)
        })
      })
    }
  }
}
