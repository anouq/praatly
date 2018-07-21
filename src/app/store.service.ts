import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class StoreService {

  public types = [];
  public statsMap = [];

  @Output() public typesEmitter: EventEmitter<any> = new EventEmitter();
  @Output() public statsMapEmitter: EventEmitter<any> = new EventEmitter();

  public setTypes(newTypes: string[]): void {
    this.types = newTypes;
    this.typesEmitter.emit(this.types);
  }

  public setStatsMap(newStatsMap: object[]): void {
    this.statsMap = newStatsMap;
    this.statsMapEmitter.emit(this.statsMap);
  }

}
