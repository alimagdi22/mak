import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  selector: 'app-schedule-tab',
  templateUrl: './schedule-tab.component.html',
  styleUrl: './schedule-tab.component.scss',
})
export class ScheduleTabComponent {
  @Output() scheduleTabChange = new EventEmitter<number>();

  flightTypeIndex = 0;

  onSelect(flightTypeIndex: number) {
    this.flightTypeIndex = flightTypeIndex;
    this.scheduleTabChange.emit(flightTypeIndex);
  }
}
