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
          backgroundColor: ['#4d80ad', '#abd3f5', '#18eaae', '#60c4ae'],
          borderColor: '#1062a8',
          borderWidth: 1,
        },
      ];
    });
  }
}
