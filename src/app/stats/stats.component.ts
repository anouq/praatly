import { Component } from '@angular/core';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  public statsMap = this.storeService.statsMap;
  public types = this.storeService.types;

  constructor(private storeService: StoreService) {
    storeService.typesEmitter.subscribe((types) => this.types = types);
    storeService.statsMapEmitter.subscribe((statsMap) => this.statsMap = statsMap);
  }
}
