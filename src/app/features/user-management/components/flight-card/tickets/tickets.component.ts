import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPassengerDetail } from 'rp-travel-ui';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent {
  @Output() clickCancel = new EventEmitter<null>();
  @Input() tickets: IPassengerDetail[] = [];

  onClickCancel() {
    this.clickCancel.emit(null);
  }
}
