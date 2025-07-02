import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CapituloService } from '../../../services/capitulo.service';

@Component({
  selector: 'app-capitulosdescargadosxusuario',
  imports: [BaseChartDirective],
  templateUrl: './capitulosdescargadosxusuario.component.html',
  styleUrl: './capitulosdescargadosxusuario.component.css',
})
export class CapitulosdescargadosxusuarioComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'pie';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private cS: CapituloService) {}

  ngOnInit(): void {
    this.cS.getQuantityCapDes().subscribe((data) => {
      this.barChartLabels = data.map((item) => `${item.usNombre} \n ${item.novTitulo}`);
      this.barChartData = [
        {
          data: data.map((item) => item.cantidadDescargas),
          label: 'Suma',
          backgroundColor: ['#4d80ad', '#abd3f5', '#18eaae', '#60c4ae'],
          borderColor: '#1062a8',
          borderWidth: 1,
        },
      ];
    });
  }
}
