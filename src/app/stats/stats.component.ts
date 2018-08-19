import { Component } from '@angular/core';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  public plotStatsMap = this.storeService.plotStatsMap;
  public statsMap = this.storeService.statsMap;
  public types = this.storeService.types;

  constructor(private storeService: StoreService) {
    storeService.plotStatsMapEmitter.subscribe((plotsStatsMap) => this.plotStatsMap = plotsStatsMap);
    storeService.statsMapEmitter.subscribe((statsMap) => this.statsMap = statsMap);
    storeService.typesEmitter.subscribe((types) => this.types = types);
  }
}
