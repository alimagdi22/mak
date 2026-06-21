import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IFlightDTO } from 'rp-travel-ui';
import { SharedService } from '../../../../../../../../shared/shared.service';
@Component({
  selector: 'app-flight-path',
  templateUrl: './flight-path.component.html',
  styleUrl: './flight-path.component.scss',
})
export class FlightPathComponent implements OnInit {
  @Input({ required: true }) flightSegment!: IFlightDTO;

  @Input({ required: true }) airlineLogo = '';
  @Input({ required: true }) airlineName = '';
  @Input({ required: true }) cabinClass = '';
  @Input({ required: true }) terminal = '';
  public sharedService = inject(SharedService)

  translate = inject(TranslateService);

  deptDate = '';
  deptCityName = '';
  deptAirportName = '';

  landDate = '';
  arrivalCityName = '';
  arrivalAirportName = '';

  segmentDuration = 0;

  ngOnInit(): void {
    this.deptDate = this.flightSegment.departureDate;
    this.deptCityName = this.flightSegment.departureTerminalAirport.cityName;
    this.deptAirportName = this.flightSegment.departureTerminalAirport.airportName;

    this.landDate = this.flightSegment.arrivalDate;
    this.arrivalCityName = this.flightSegment.arrivalTerminalAirport.cityName;
    this.arrivalAirportName = this.flightSegment.arrivalTerminalAirport.airportName;

    this.segmentDuration = this.flightSegment.durationPerLeg;
  }
}
