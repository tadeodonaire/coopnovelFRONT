import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Biblioteca } from '../../../models/biblioteca';
import { BibliotecaService } from '../../../services/biblioteca.service';

@Component({
  providers: [provideNativeDateAdapter()],
  selector: 'app-crear-editar-biblioteca',
  imports: [MatInputModule,MatIconModule,FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatRadioModule, MatSelectModule, MatDatepickerModule, MatSelectModule, MatButtonModule],
  templateUrl: './crear-editar-biblioteca.component.html',
  styleUrl: './crear-editar-biblioteca.component.css'
})
export class CrearEditarBibliotecaComponent implements OnInit{

  form: FormGroup = new FormGroup({});
  Biblioteca: Biblioteca = new Biblioteca();

  constructor(
    private bS: BibliotecaService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
    });
  }
  aceptar() {
    if (this.form.valid) {
      this.Biblioteca.bibNombre = this.form.value.nombre;

      this.bS.insert(this.Biblioteca).subscribe(() => {
        this.bS.list().subscribe((data) => {
          this.bS.setList(data);
        });
      });
    }
    this.router.navigate(['biblioteca']);
  }

}
