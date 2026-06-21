import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { flightOfflineService } from 'rp-travel-ui';
@Component({
  selector: 'app-branded-fare-info-modal',
  templateUrl: './branded-fare-info-modal.component.html',
  styleUrls: ['./branded-fare-info-modal.component.scss'],
})
export class BrandedFareInfoModalComponent {
  public translate = inject(TranslateService);
  isOpen = false;
  @Output() closed = new EventEmitter<void>();
   @Input() offlineServices!: flightOfflineService[];
   buttonService?: flightOfflineService;
 ngOnChanges(changes: SimpleChanges): void {
    if (changes['offlineServices'] && this.offlineServices?.length) {
      this.buttonService = this.offlineServices.find(
        (s) => s.serviceType === 'button'
      );
    }
  }
   open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
    this.closed.emit();
  }
  
}
