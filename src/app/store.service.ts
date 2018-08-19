import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class StoreService {

  public plotStatsMap = [];
  public statsMap = [];
  public types = [];
  public emptyPlot = false;

  @Output() public plotStatsMapEmitter: EventEmitter<any> = new EventEmitter();
  @Output() public statsMapEmitter: EventEmitter<any> = new EventEmitter();
  @Output() public typesEmitter: EventEmitter<any> = new EventEmitter();

  public setPlotStatsMap(newPlotStatsMap: object[]): void {
    this.plotStatsMap = newPlotStatsMap;
    this.plotStatsMapEmitter.emit(this.plotStatsMap);
  }

  public setStatsMap(newStatsMap: object[]): void {
    this.statsMap = newStatsMap;
    this.statsMapEmitter.emit(this.statsMap);
  }

  public setTypes(newTypes: string[]): void {
    this.types = newTypes;
    this.typesEmitter.emit(this.types);
  }

  public resetStats(): void {
    this.plotStatsMap = [];
    this.plotStatsMapEmitter.emit(this.plotStatsMap);

    this.statsMap = [];
    this.statsMapEmitter.emit(this.statsMap);

    this.types = [];
    this.typesEmitter.emit(this.types);

    this.emptyPlot = true;
  }

}
