import { NgStyle } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../shared.service';
@Component({
  selector: 'app-flight-card-skeleton-loader',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './flight-card-skeleton-loader.component.html',
  styleUrls: ['./flight-card-skeleton-loader.component.scss'],
})
export class FlightCardSkeletonLoaderComponent {
  @Input() width: string = '95%'; // Default width if not provided
  public sharedService = inject(SharedService);
}
