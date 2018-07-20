import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  private rawPraat = [];

  public uploadPraat(input: any): void {
    this.rawPraat = [];
    for (let i = 0; i < input.files.length; i++) {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        let date = input.files[i].name.substr(6, 11);
        if (date.endsWith('_')) {
          date = date.slice(0, -1);
        }

        this.rawPraat.push(this.convertPraat(reader.result, date));
      };
      reader.readAsText(input.files[i]);
    }
  }

  private convertPraat(file: any, date: string): void {
    const [first, ...lines] = file.split('\n');
    return lines
      .filter(line => typeof line[0] !== 'undefined')
      .map(line => {
        return `date,${first}`
          .split(',')
          .reduce((curr, next, i) => ({
            ...curr, [next]: `${date},${line}`.split(',')[i]
          }), {});
      });
  }

}
