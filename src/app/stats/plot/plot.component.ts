import { Component, Input } from '@angular/core';
import * as Plotly from './plotly.js';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent {
  @Input() public i: any;
  @Input() public typePlotStats: any;

  constructor() {
    setTimeout(() => this.generatePlot(), 200);
  }

  private generatePlot(): void {
    const layout = {
      xaxis: {
        rangeselector: {
          buttons: [
            { count: 1, label: '1 month', step: 'month', stepmode: 'backward' },
            { count: 6, label: '6 months', step: 'month', stepmode: 'backward' },
            { count: 1, label: '1 year', step: 'year', stepmode: 'backward' },
            { step: 'all' }
          ]
        },
        type: 'date'
      },
      yaxis: {
        title: 'Hertz',
        rangemode: 'tozero',
        autorange: true
      },
      showlegend: true,
      legend: { 'orientation': 'v' }
    };

    Plotly.plot(`plot-${this.i}`, [this.typePlotStats['maxPitch'],
      this.typePlotStats['meanPitch'], this.typePlotStats['minPitch']], layout);

    const plotElement = Plotly.d3.select(`div#plot-${this.i}`).node();

    window.onresize = () => {
      Plotly.Plots.resize(plotElement);
    };
  }
}
