import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CapituloService } from '../../../services/capitulo.service';
import { NumeroCapitulosPorNovelaDTO } from '../../../models/numeroCapitulosPorNovelaDTO';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-numero-capitulos',
  imports: [MatFormFieldModule,MatIconModule,CommonModule,ReactiveFormsModule,MatLabel,MatCardModule,MatInputModule,MatButtonModule,MatSnackBarModule],
  templateUrl: './numero-capitulos.component.html',
  styleUrl: './numero-capitulos.component.css',
})
export class NumeroCapitulosComponent implements OnInit {
  form: FormGroup;
  resultados: NumeroCapitulosPorNovelaDTO[] = [];

  constructor(
    private cS: CapituloService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = fb.group({
      titulo: [''],
    });
  }

  ngOnInit(): void {}

  buscar() {
    const titulo = this.form.get('titulo')?.value.trim();

    if (titulo.length >= 2) {
      this.cS.getNumeroCapitulos(titulo).subscribe({
        next: (data) => {
          this.resultados = data;
          if (data.length === 0) {
            this.snackBar.open('La novela no está en nuestra plataforma.', 'Cerrar', {
              duration: 3000,
            });
          }
        },
        error: (e) => {
          console.error('Error al buscar:', e);
          this.resultados = [];
          this.snackBar.open('Ocurrió un error en la búsqueda.', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    } else {
      this.snackBar.open('Ingrese al menos 2 caracteres.', 'Cerrar', {
        duration: 2500,
      });
      this.resultados = [];
    }
  }
}