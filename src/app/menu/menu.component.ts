import { Component } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  private static readonly TYPE = 'type';
  private all = [];
  private rawPraat = [];

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
      .filter((value, i, t) => t.indexOf(value) === i)];

    types.forEach((type) => {
      // If type of recording type is null, use all recordings; otherwise, split recordings by type
      const byType = type === null ? this.all : _.groupBy(this.all, MenuComponent.TYPE)[type];

      const statsMap = _.chain(byType)
        .groupBy('date')
        .map((byDate, key) => ({
          date: moment(key, 'YYYY-MMM-D').format('YYYY-MM-DD'),
          minPitch: _.ceil(_.minBy(byDate, 'minPitch')['minPitch']),
          maxPitch: _.ceil(_.maxBy(byDate, 'maxPitch')['maxPitch']),
          minutes: _.ceil(_.sumBy(byDate, 'sec') / 60),
          recordings: byDate.length
        }))
        .value();
    });
  }
}
