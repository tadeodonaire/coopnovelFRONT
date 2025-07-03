import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule, MatFormField } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CorreccionIAService } from '../../../services/correccion-ia.service';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { CapituloService } from '../../../services/capitulo.service';
import { Capitulos } from '../../../models/capitulos';
import { CorreccionesIA } from '../../../models/correccionesIA';

@Component({
  selector: 'app-creareditarcorrecciones-ia',
  imports: [MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './creareditarcorrecciones-ia.component.html',
  styleUrl: './creareditarcorrecciones-ia.component.css'
})
export class CreareditarcorreccionesIAComponent {

  form: FormGroup= new FormGroup({});
  listaCapitulos: Capitulos[] = [];
  correccionIA: CorreccionesIA = new CorreccionesIA();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cS: CapituloService,
    private coS: CorreccionIAService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      id: [''],
      correccionIA: ['', [Validators.required]],
      capitulos: ['', [Validators.required]]
    });

    this.cS.list().subscribe(data => {
      this.listaCapitulos = data;
    });
  }

  aceptar(){
    if(this.form.valid) {
      this.correccionIA.idCorreccionIA = this.form.value.id;
      this.correccionIA.corCorreccionIA = this.form.value.correccionIA;
      this.correccionIA.capitulos.idCapitulo = this.form.value.capitulos;

      console.log(this.form.value);

      if (this.edicion) {
        this.coS.update(this.correccionIA).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
        });
      }) 
    }else {
        this.coS.insert(this.correccionIA).subscribe((data) => {
          this.coS.list().subscribe((data)=>{
            this.coS.setList(data);
          })
        });
      }
    }
    this.router.navigate(['correccionIA'])
  }

  init(){
    if(this.edicion){
      this.coS.listId(this.id).subscribe((data)=>{
        this.form=new FormGroup({
          id: new FormControl(data.idCorreccionIA),
          correccion: new FormControl(data.corCorreccionIA),
          capitulos: new FormControl(data.capitulos.idCapitulo),
        })
      })
    }
  }
}
