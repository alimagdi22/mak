import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import { MostSearchedFlightsService } from './most-searched-flights.service';

@Component({
  selector: 'app-most-searched-flights',
  templateUrl: './most-searched-flights.component.html',
  styleUrl: './most-searched-flights.component.scss',
})
export class MostSearchedFlightsComponent implements AfterViewInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  public mostSearchedFlightsService = inject(MostSearchedFlightsService);
  public sharedService = inject(SharedService);

  ngAfterViewInit(): void {
    const swiper = this.swiperEl.nativeElement;

    Object.assign(swiper, {
      spaceBetween: 60,
      pagination: { 
        clickable: true,
        dynamicBullets: true, // 👈 show limited bullets
        dynamicMainBullets: 5 // 👈 max number of visible bullets
      },      
      breakpoints: {
        0: { slidesPerView: 1 }, // Mobile view (default)
        768: { slidesPerView: 2 }, // Tablets
        1024: { slidesPerView: 3 }, // Desktops
      },
    });
  }
}
