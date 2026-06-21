import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';

@Component({
  selector: 'app-most-popular-airlines',
  templateUrl: './most-popular-airlines.component.html',
  styleUrl: './most-popular-airlines.component.scss',
})
export class MostPopularAirlinesComponent implements AfterViewInit {
  popularAirlines = [
    'assets/images/popular-airlines/egypt-air.png',
    'assets/images/popular-airlines/Emirates-Symbol 1.png',
    'assets/images/popular-airlines/الشركة-السعودية-لهندسة-وصناعة-الطيران 1.png',
    'assets/images/popular-airlines/ku.png',
    'assets/images/popular-airlines/gf.png',
    'assets/images/popular-airlines/ey.png',
  ];
  public sharedService = inject(SharedService);

  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  ngAfterViewInit(): void {
    const swiper = this.swiperEl.nativeElement;
    const isWideScreen = window.innerWidth > this.sharedService.webViewBreakPoint;

    Object.assign(swiper, {
      slidesPerView: 2, // Default value
      spaceBetween: 20,
      pagination: { bulletClass: 'hide' },
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 10,
        },
      },
    });
  }
}
