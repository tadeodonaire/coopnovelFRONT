import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Novelasbibliotecas } from '../../../models/novelasbibliotecas';
import { Novela } from '../../../models/novela';
import { Biblioteca } from '../../../models/biblioteca';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { NovelasbibliotecasService } from '../../../services/novelasbibliotecas.service';
import { NovelaService } from '../../../services/novela.service';
import { BibliotecaService } from '../../../services/biblioteca.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creareditarnovelasbibliotecas',
  imports: [ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './creareditarnovelasbibliotecas.component.html',
  styleUrl: './creareditarnovelasbibliotecas.component.css'
})
export class CreareditarnovelasbibliotecasComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  novelasbibliotecas: Novelasbibliotecas = new Novelasbibliotecas;
  id: number = 0;
  edicion: boolean = false;
  listaNovelas: Novela[] = [];
  listaBibliotecas: Biblioteca[] = [];

  constructor(
    private nbS: NovelasbibliotecasService,
    private nS: NovelaService,
    private Bs: BibliotecaService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snacbar: MatSnackBar,
    private route: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id=data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      biblioteca: ['', [Validators.required]],
      novela: ['', [Validators.required]],
  });
  this.Bs.list().subscribe(data => {
    this.listaBibliotecas = data;
  });
  this.nS.list().subscribe(data => {
    this.listaNovelas = data;
  });
}

aceptar(){
  if(this.form.valid){
    this.novelasbibliotecas.idNovelaBiblioteca = this.form.value.codigo;
    this.novelasbibliotecas.biblioteca.idBiblioteca = this.form.value.biblioteca;
    this.novelasbibliotecas.novelas.idNovela = this.form.value.novela;

    console.log(this.form.value);

    if(this.edicion){
      this.nbS.update(this.novelasbibliotecas).subscribe((data) => {
        this.nbS.list().subscribe(data => {
          this.nbS.setList(data);
        })
      })
    }else{
      console.log('Payload:', JSON.stringify(this.novelasbibliotecas));
      this.nbS.insert(this.novelasbibliotecas).subscribe((data) => {
        this.nbS.list().subscribe(data => {
          this.nbS.setList(data);
        })
      });
    }
  }
  this.router.navigate(['novelasbibliotecas']);
}

init(){
  if(this.edicion){
    this.nbS.listId(this.id).subscribe(data => {
    this.form = new FormGroup({
      idNovelaBiblioteca: new FormControl(data.idNovelaBiblioteca),
      idBiblioteca: new FormControl(data.biblioteca.idBiblioteca),
      idNovela: new FormControl(data.novelas.idNovela),
    })
    });
  }
}
}
