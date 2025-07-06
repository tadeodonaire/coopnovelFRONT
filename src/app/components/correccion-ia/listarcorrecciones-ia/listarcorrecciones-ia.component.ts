import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { CorreccionesIA } from '../../../models/correccionesIA';
import { CorreccionIAService } from '../../../services/correccion-ia.service';
import { LoginService } from '../../../services/login.service';
import { CapituloService } from '../../../services/capitulo.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listarcorrecciones-ia',
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './listarcorrecciones-ia.component.html',
  styleUrl: './listarcorrecciones-ia.component.css',
})
export class ListarcorreccionesIAComponent implements OnInit {
  dataSource: MatTableDataSource<CorreccionesIA> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'capitulo', 'correccion', 'implementar', 'eliminar'];
  isLoading = false;  // Controlador del estado de carga

  constructor(
    private coS: CorreccionIAService, 
    private cS: CapituloService, 
    private loginService: LoginService, 
    private router: Router,
    private snackBar: MatSnackBar // Para mostrar el snackbar
  ) {}

  ngOnInit(): void {
    const rol = this.loginService.showRole();
    if (rol === 'AUTOR' || rol === 'ADMINISTRADOR') {
      this.displayedColumns.push('implementar');
    }

    // Obtener las correcciones
    this.coS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  // Método para implementar la corrección en el capítulo
  implementarCorreccion(correccion: CorreccionesIA) {
    this.isLoading = true; // Activamos el spinner

    const capituloId = correccion.capitulos.idCapitulo;  // Obtenemos el ID del capítulo desde la corrección

    // Obtener el capítulo
    this.cS.listId(capituloId).subscribe((capitulo) => {
      capitulo.capContenido = correccion.corCorreccionIA;  // Asignamos la corrección al contenido del capítulo

      // Actualizamos el capítulo con el nuevo contenido
      this.cS.update(capitulo).subscribe(() => {
        this.isLoading = false; // Desactivamos el spinner

        // Redirigimos a la página de listar capítulos
        this.router.navigate(['capitulo']);

        // Mostramos el mensaje de éxito en un snackbar
        this.snackBar.open('Se corrigió correctamente', 'Cerrar', {
          duration: 3000,  // Duración del mensaje
          panelClass: ['snackbar-success']  // Estilo del snackbar (opcional)
        });
      });
    });
  }

  // Verifica si el usuario es un autor
  isAutor(): boolean {
    return this.loginService.showRole() === 'AUTOR';
  }

  // Eliminar corrección
  eliminar(id: number) {
    this.coS.deleteCorreccionIA(id).subscribe(() => {
      this.coS.list().subscribe((data) => {
        this.coS.setList(data);
      });
    });
  }
}