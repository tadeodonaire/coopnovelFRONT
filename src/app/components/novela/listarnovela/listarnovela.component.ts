import { Component, OnInit, ViewChild } from '@angular/core';
import { Novela } from '../../../models/novela';
import { NovelaService } from '../../../services/novela.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CapituloService } from '../../../services/capitulo.service';
import { Capitulos } from '../../../models/capitulos';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NovelaFullDTO } from '../../../models/NovelaFULLDTO';
import { Roles } from '../../../models/roles';

@Component({
  selector: 'app-listarnovela',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './listarnovela.component.html',
  styleUrl: './listarnovela.component.css',
})
export class ListarnovelaComponent implements OnInit {
  dataSource: MatTableDataSource<NovelaFullDTO> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
  capitulos: Capitulos[] = [];
  selectedNovelaId: number | null = null;
  expansionState: { [key: number]: boolean } = {};
  capitulosPorNovela: { [novelaId: number]: Capitulos[] } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private nS: NovelaService,
    private snacbar: MatSnackBar,
    private capituloService: CapituloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token!);
    const idUsuario = decodedToken.idUsuario;
    console.log(decodedToken)

    this.nS.getNovelasFull().subscribe((data) => {
      const novelasDelUsuario = data.filter((n) => n.idUsuario === idUsuario);
      this.dataSource.data = novelasDelUsuario;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Método para eliminar una novela
  eliminar(id: number) {
    this.capituloService.listByNovelaId(id).subscribe((data: Capitulos[]) => {
      if (data.length > 0) {
        this.snacbar.open(
          'No se pudo eliminar esta novela porque tiene capítulos',
          'Cerrar',
          {
            duration: 3000,
            verticalPosition: 'top',
          }
        );
      } else {
        this.nS.deleteN(id).subscribe(() => {
          this.nS.list().subscribe((data) => {
            this.nS.setList(data);
          });
        });
        this.snacbar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    });
  }

  // Método para aumentar el capítulo
  aumentarCapitulo(novela: NovelaFullDTO) {
    this.router.navigate(['capitulo/insertar', novela.idNovela]);
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  tieneCapitulos(novelaId: number): boolean {
    return (
      this.selectedNovelaId === novelaId &&
      this.capitulosPorNovela[novelaId] &&
      this.capitulosPorNovela[novelaId].length > 0
    );
  }

obtenerCapitulos(novelaId: number) {
  const token = sessionStorage.getItem('token');
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(token!);

  if (this.selectedNovelaId === novelaId) {
    this.selectedNovelaId = null;
  } else {
    const novelaSeleccionada = this.dataSource.data.find(
      (n) => n.idNovela === novelaId
    );
    if (novelaSeleccionada) {
this.nS.listByNovelaId(novelaId).subscribe((capitulos: Capitulos[]) => {
  this.capitulosPorNovela[novelaId] = capitulos;
  this.selectedNovelaId = novelaId;
});
    }
  }
}

  toggleCapituloContent(capitulo: Capitulos) {
    this.expansionState[capitulo.idCapitulo] =
      !this.expansionState[capitulo.idCapitulo];
  }

  eliminarCapitulo(id: number) {
    this.capituloService.deleteC(id).subscribe(() => {
      this.capituloService.list().subscribe((data: Capitulos[]) => {
        this.capituloService.setList(data);
      });
      this.snacbar.open('Capítulo eliminado correctamente', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
      });
    });
  }

  editarCapitulo(capitulo: Capitulos) {
    this.router.navigate(['/capitulo/ediciones', capitulo.idCapitulo]);
  }
  mejorarConIA(idCapitulo: number) {
    // Redirigir a la ruta de correcciónIA/insertar y pasar el idCapitulo
    this.router.navigate([`/correccionIA/insertar`, idCapitulo]);
  }
}
