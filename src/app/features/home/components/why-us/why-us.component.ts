import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { whyUsCards } from '../../../../core/constants/whyUsCards';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../shared/shared.service';

@Component({
  selector: 'app-why-us',
  templateUrl: './why-us.component.html',
  styleUrl: './why-us.component.scss',
})
export class WhyUsComponent implements AfterViewInit {
  public whyUsCards = whyUsCards;
  public translate = inject(TranslateService);
  public sharedService = inject(SharedService);

  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  ngAfterViewInit(): void {
    const swiper = this.swiperEl.nativeElement;

    Object.assign(swiper, {
      spaceBetween: 60,
      pagination: { bulletClass: 'hide' },
      breakpoints: {
        0: { slidesPerView: 1 }, // Mobile view (default)
        768: { slidesPerView: 2 }, // Tablets
        1024: { slidesPerView: 3 }, // Desktops
      },
    });
  }
}
