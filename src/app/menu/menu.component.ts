import { Component } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  private static readonly TYPE = 'type';

  public readonly error = 'Something went wrong. The uploaded file(s) are probably corrupt. Please try again.';
  public hasError = false;
  public isDemoActive = false;
  public readonly progress = 'Generating output. Please wait a moment.';
  public inProgress = false;

  private all = [];
  private rawPraat = [];

  private readonly plotStatsTemplate = {
    maxPitch: { x: [], y: [], mode: 'lines', name: 'Max', type: 'scatter' },
    meanPitch: { x: [], y: [], mode: 'lines', name: 'Mean', type: 'scatter' },
    minPitch: { x: [], y: [], mode: 'lines', name: 'Min', type: 'scatter' }
  };

  constructor(private storeService: StoreService) {
    this.runDemo();
  }

  public uploadPraat(input: any): void {
    this.storeService.resetStats();
    this.inProgress = true;
    this.hasError = false;

    this.rawPraat = [];
    for (let i = 0; i < input.files.length; i++) {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        let date = input.files[i].name.substr(6, 11);
        if (date.endsWith('_')) { // For days 1-9
          date = date.slice(0, -1);
        }
        this.rawPraat.push(this.convertPraat(reader.result, date));
      };
      reader.readAsText(input.files[i]);
    }

    setTimeout(() => {
      this.aggregateResults();

      this.hasError = this.all.length < 1;
      if (!this.hasError) {
        this.summarizeResults();
      }

    }, 100);
    this.isDemoActive = false;
  }

  private convertPraat(file: any, date: string): void {
    const [first, ...lines] = file.split('\n');
    return lines
      .filter(line => typeof line[0] !== 'undefined')
      .map(line => {
        return `date,${first}` // Manually add date column
          .split(',')
          .reduce((curr, next, i) => ({
            ...curr, [next]: `${date},${line}`.split(',')[i]
          }), {});
      });
  }

  private aggregateResults(): void {
    this.all = [];
    this.rawPraat.forEach((file) => {
      file.forEach((recording) => {
        if (!recording[MenuComponent.TYPE]) {
          this.hasError = true;
          this.inProgress = false;

          return;
        }

        recording[MenuComponent.TYPE] = recording[MenuComponent.TYPE].trim().replace(/\W+/g, '_');
        ['minPitch', 'meanPitch', 'maxPitch', 'n', 'sec'].forEach(key => recording[key] = Number(recording[key]));
        this.all.push(recording);
      });
    });
  }

  private summarizeResults(): void {
    const types = [null, ...this.all // null represents total
      .map(item => item[MenuComponent.TYPE])
      .filter((value, i, t) => t.indexOf(value) === i)
      .sort()];
    this.storeService.setTypes(types);

    const statsMap = [];
    const plotStatsMap = [];

    for (let t = 0; t < types.length; t++) {
      // If type of recording type is null, use all recordings; otherwise, group recordings by type
      const byType = types[t] === null ? this.all : _.groupBy(this.all, MenuComponent.TYPE)[types[t]];

      statsMap[t] = _.sortBy(_.chain(byType)
        .groupBy('date')
        .forEach((byDate) => {
          byDate.forEach((recording) => recording['totalPitch'] = recording['meanPitch'] * recording['n']);
        })
        .map((byDate, key) => ({
          date: moment(key, 'YYYY-MMM-D').format('YYYY-MM-DD'),
          minPitch: _.ceil(_.minBy(byDate, 'minPitch')['minPitch']),
          meanPitch: _.ceil(_.sumBy(byDate, 'totalPitch') / _.sumBy(byDate, 'n')),
          maxPitch: _.ceil(_.maxBy(byDate, 'maxPitch')['maxPitch']),
          minutes: moment.utc(_.sumBy(byDate, 'sec') * 1000).format('mm:ss'),
          recordings: byDate.length
        }))
        .value(), 'date');

      const individualPlotStats = JSON.parse(JSON.stringify(this.plotStatsTemplate));

      statsMap[t].forEach((daily) => {
        ['minPitch', 'meanPitch', 'maxPitch'].forEach((val) => {
          individualPlotStats[val]['x'].push(daily['date']);
          individualPlotStats[val]['y'].push(daily[val]);
        });
      });

      plotStatsMap[t] = individualPlotStats;
    }

    this.storeService.setStatsMap(statsMap);
    this.storeService.setPlotStatsMap(plotStatsMap);

    this.inProgress = false;
  }

  public runDemo(): void {
    this.hasError = false;
    this.isDemoActive = true;
    this.inProgress = false;

    this.storeService.resetStats();

    const mockType = 'Demo';

    const mockSummaryStats = [
      { date: '2018-04-27', minPitch: 312, meanPitch: 456, maxPitch: 650, minutes: moment.utc(30000).format('mm:ss') },
      { date: '2018-04-29', minPitch: 234, meanPitch: 477, maxPitch: 678, minutes: moment.utc(50000).format('mm:ss') },
      { date: '2018-05-01', minPitch: 321, meanPitch: 345, maxPitch: 660, minutes: moment.utc(20000).format('mm:ss') },
      { date: '2018-05-02', minPitch: 266, meanPitch: 440, maxPitch: 690, minutes: moment.utc(18000).format('mm:ss') },
    ];

    const mockPlotStats = JSON.parse(JSON.stringify(this.plotStatsTemplate));

    mockPlotStats.maxPitch = {
      x: ['2018-04-27', '2018-04-29', '2018-05-01', '2018-05-02', '2018-05-10'],
      y: [650, 678, 660, 690, 704], mode: 'lines', name: 'Max', type: 'scatter'
    };

    mockPlotStats.meanPitch = {
      x: ['2018-04-27', '2018-04-29', '2018-05-01', '2018-05-02', '2018-05-10'],
      y: [456, 477, 345, 440, 456], mode: 'lines', name: 'Mean', type: 'scatter'
    };

    mockPlotStats.minPitch = {
      x: ['2018-04-27', '2018-04-29', '2018-05-01', '2018-05-02', '2018-05-10'],
      y: [312, 234, 321, 266, 278], mode: 'lines', name: 'Min', type: 'scatter'
    };

    this.storeService.setTypes([mockType]);
    this.storeService.setPlotStatsMap([mockPlotStats]);
    this.storeService.setStatsMap([mockSummaryStats]);
  }

}
