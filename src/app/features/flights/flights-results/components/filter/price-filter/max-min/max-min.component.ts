import { Component, inject, Input } from '@angular/core';
import { HomePageService } from 'rp-travel-ui';

@Component({
  selector: 'app-max-min',
  templateUrl: './max-min.component.html',
  styleUrl: './max-min.component.scss',
})
export class MaxMinComponent {
  @Input({ required: true }) price = 0;
  @Input({ required: true }) title = '';

  homePageService = inject(HomePageService);
}
