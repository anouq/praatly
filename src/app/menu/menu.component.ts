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
  private all = [];
  private rawPraat = [];

  constructor(private storeService: StoreService) {
  }

  public uploadPraat(input: any): void {
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

    setTimeout(() => this.generateStatsMap(), 100);
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

  private generateStatsMap(): void {
    this.all = [];
    this.rawPraat.forEach((file) => {
      file.forEach((recording) => {
        recording[MenuComponent.TYPE] = recording[MenuComponent.TYPE].trim().replace(/\W+/g, '_');
        ['minPitch', 'meanPitch', 'maxPitch', 'n', 'sec'].forEach(key => recording[key] = Number(recording[key]));
        this.all.push(recording);
      });
    });

    const types = [null, ...this.all // null represents total
      .map(item => item[MenuComponent.TYPE])
      .filter((value, i, t) => t.indexOf(value) === i)
      .sort()];
    this.storeService.setTypes(types);

    const statsMap = [];

    for (let t = 0; t < types.length; t++) {
      // If type of recording type is null, use all recordings; otherwise, group recordings by type
      const byType = types[t] === null ? this.all : _.groupBy(this.all, MenuComponent.TYPE)[types[t]];

      statsMap[t] = _.sortBy(_.chain(byType)
        .groupBy('date')
        .map((byDate, key) => ({
          date: moment(key, 'YYYY-MMM-D').format('YYYY-MM-DD'),
          minPitch: _.ceil(_.minBy(byDate, 'minPitch')['minPitch']),
          // TODO: Add mean pitch
          maxPitch: _.ceil(_.maxBy(byDate, 'maxPitch')['maxPitch']),
          minutes: moment.utc(_.sumBy(byDate, 'sec') * 1000).format('mm:ss'),
          recordings: byDate.length
        }))
        .value(), 'date');
    }

    this.storeService.setStatsMap(statsMap);
  }

}
