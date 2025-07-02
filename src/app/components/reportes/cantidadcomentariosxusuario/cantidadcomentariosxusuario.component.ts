import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ComentarioService } from '../../../services/comentario.service';

@Component({
  selector: 'app-cantidadcomentariosxusuario',
  imports: [BaseChartDirective],
  templateUrl: './cantidadcomentariosxusuario.component.html',
  styleUrl: './cantidadcomentariosxusuario.component.css',
})
export class CantidadcomentariosxusuarioComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'pie';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private comS: ComentarioService) {}

  ngOnInit(): void {
    this.comS.getQuantityComUs().subscribe((data) => {
      this.barChartLabels = data.map((item) => `${item.usNombre} \n ${item.capTitulo}`);
      this.barChartData = [
        {
          data: data.map((item) => item.cantidadComentarios),
          label: 'Suma',
          backgroundColor: ['#4d80ad', '#abd3f5', '#18eaae', '#60c4ae'],
          borderColor: '#1062a8',
          borderWidth: 1,
        },
      ];
    });
  }
}
