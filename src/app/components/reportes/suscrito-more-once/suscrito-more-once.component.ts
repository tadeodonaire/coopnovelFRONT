import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SuscripcionesService } from '../../../services/suscripciones.service';

@Component({
  selector: 'app-suscrito-more-once',
  imports: [BaseChartDirective],
  templateUrl: './suscrito-more-once.component.html',
  styleUrl: './suscrito-more-once.component.css'
})
export class SuscritoMoreOnceComponent {
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private sS: SuscripcionesService) { }

  ngOnInit(): void {
    this.sS.getUsersSubscribedMore().subscribe((data) => {
      this.barChartLabels = data.map((item) => `${item.idUsuario}: ${item.usNombre}\n${item.usApellido}`);
      this.barChartData = [
        {
          data: data.map((item) => item.totalSuscripciones),
          label: 'Cantidad de Comentarios',
          backgroundColor: ['#d6b1ff', '#6a1b9a', '#18eaae', '#60c4ae'],
          borderColor: '#1062a8',
          borderWidth: 1,
          borderRadius: 12, // ✅ Barras redondeadas
          borderSkipped: false, // ✅ Redondear todos los bordes

          // ✅ Efectos adicionales
          hoverBackgroundColor: '#7b1fa2',
          hoverBorderColor: '#4a148c',
          hoverBorderWidth: 3,

          // ✅ Controlar ancho de barras
          barPercentage: 0.3,     // ✅ Más pequeño = barras más delgadas (0.1 - 1.0)
          categoryPercentage: 0.7, // ✅ Más pequeño = más espacio entre grupos
        },
      ];

      // ✅ Configurar opciones de estilo
      this.barChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#1a1b1f',
              font: {
                size: 14,
                weight: 'lighter'
              }
            }
          },
          title: {
            display: true,
            text: 'Usuarios suscritos más de una vez',
            color: '#1a1b1f',
            font: {
              family: 'Fira Sans, sans-serif',
              size: 18,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#1a1b1f',
              font: {
                size: 14,
                weight: 'lighter',
              }
            },
            grid: {
              color: 'rgba(67, 63, 57, 0.41)'
            }
          },
          x: {
            ticks: {
              color: '#1a1b1f',
              font: {
                size: 14,
                weight: 'lighter'
              }
            },
            grid: {
              color: 'rgba(67, 63, 57, 0.41)'
            }
          }
        }
      };
    });
  }
}
