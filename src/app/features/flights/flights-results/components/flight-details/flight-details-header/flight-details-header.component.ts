import { Component, inject, Input, OnInit } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';
import { SharedService } from '../../../../../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-flight-details-header',
  templateUrl: './flight-details-header.component.html',
  styleUrl: './flight-details-header.component.scss',
})
export class FlightDetailsHeaderComponent {
  dialog = inject(MatDialog);

  sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);

  onClickExit() {
    this.dialog.closeAll();
  }
}
