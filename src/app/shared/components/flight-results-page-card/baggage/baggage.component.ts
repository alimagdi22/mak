import { Component, inject, Input, OnInit } from '@angular/core';
import { FlightResultService, IBaggageInformation } from 'rp-travel-ui';
import { SharedService } from '../../../shared.service';
import { BaggageInfoComponent } from './baggage-info/baggage-info.component';

@Component({
  selector: 'app-baggage',
  standalone: true,
  imports: [BaggageInfoComponent],
  templateUrl: './baggage.component.html',
  styleUrl: './baggage.component.scss',
})
export class BaggageComponent implements OnInit {
  @Input() baggageInfo: IBaggageInformation[] = [];
  @Input() padding: number = 0;
  @Input() searchCriteria?: any;
  @Input() index?:number;

  public sharedService = inject(SharedService);
  public flightResultService = inject(FlightResultService);

  ngOnInit() {
    if (!this.baggageInfo.length) {
      this.baggageInfo = this.sharedService.baggageInfo;
    }
  }
}
