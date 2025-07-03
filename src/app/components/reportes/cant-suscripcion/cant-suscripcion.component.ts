import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UsuariosService } from '../../../services/usuarios.service';
import { QuerySuscripcionDTO } from '../../../models/QuerySuscripcionDTO';
import { Usuario } from '../../../models/usuarios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cant-suscripcion',
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './cant-suscripcion.component.html',
  styleUrl: './cant-suscripcion.component.css',
})
export class CantSuscripcionComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mes',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Suscripciones',
        },
        beginAtZero: true,
      },
    },
  };

  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  usuarios: Usuario[] = [];
  usuarioSeleccionadoId: number = 0;

  constructor(private usuarioService: UsuariosService) {}

  ngOnInit(): void {
    this.usuarioService.list().subscribe((data) => {
      this.usuarios = data;
      if (this.usuarios.length > 0) {
        this.usuarioSeleccionadoId = this.usuarios[0].idUsuario;
        this.obtenerDatos(this.usuarioSeleccionadoId);
      }
    });
  }

obtenerDatos(id: number): void {
  this.usuarioService.getSuscipcionesMes(id).subscribe((data: QuerySuscripcionDTO[]) => {
    console.log('DATA:', data); // <-- sigue siendo útil
    this.barChartLabels = data.map(item => this.getNombreMes(item.mes));
    this.barChartData = [
      {
        data: data.map(item => item.totalSuscripcion),
        label: `Usuario ${id}`,
        backgroundColor: '#4d80ad',
        borderColor: '#1062a8',
        borderWidth: 1,
      },
    ];
  });
}

  cambiarUsuario(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    this.usuarioSeleccionadoId = id;
    this.obtenerDatos(id);
  }

  // Convierte "2023-01" → "Enero 2023"
  getNombreMes(mesNumero: string | undefined): string {
    if (typeof mesNumero !== 'string') return 'Mes desconocido';

    const nombres = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const partes = mesNumero.split('-'); // se espera ['2023', '01']
    if (partes.length !== 2) return 'Formato inválido';

    const [anio, mes] = partes;
    const mesIndex = parseInt(mes, 10) - 1;

    const nombreMes = nombres[mesIndex] ?? 'Mes inválido';
    return `${nombreMes} ${anio}`;
  }
}
