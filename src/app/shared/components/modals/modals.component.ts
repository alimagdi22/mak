import { Component, inject } from '@angular/core';
import { GlobalModalComponent } from '../../../core/components/header/global-modal/global-modal.component';
import { MenuModalComponent } from '../../../core/components/header/menu-modal/menu-modal.component';
import { SharedModule } from '../../shared.module';
import { SharedService } from '../../shared.service';
import { BaggageComponent } from '../flight-results-page-card/baggage/baggage.component';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';

@Component({
  selector: 'app-modals',
  standalone: true,
  imports: [SharedModule, GlobalModalComponent, MenuModalComponent, BaggageComponent, PaymentModalComponent],
  templateUrl: './modals.component.html',
  styleUrl: './modals.component.scss',
})
export class ModalsComponent {
  public sharedService = inject(SharedService);
}
