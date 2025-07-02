import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ComentarioService } from '../../../services/comentario.service';

@Component({
  selector: 'app-top-three-commentators',
  imports: [BaseChartDirective],
  templateUrl: './top-three-commentators.component.html',
  styleUrl: './top-three-commentators.component.css'
})
export class TopThreeCommentatorsComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];

  constructor(private comS: ComentarioService) { }

  ngOnInit(): void {
    this.comS.listTopTenComentators().subscribe((data) => {
      this.barChartLabels = data.map((item) => `${item.idUsuario} : ${item.usNombre} \n ${item.usApellido}`);
      this.barChartData = [
        {
          data: data.map((item) => item.totalComentarios),
          label: 'Cantidad de Comentarios',
          backgroundColor: ['#4d80ad', '#abd3f5', '#18eaae', '#60c4ae'],
          borderColor: '#1062a8',
          borderWidth: 1,
        },
      ];
    });
  }
}
