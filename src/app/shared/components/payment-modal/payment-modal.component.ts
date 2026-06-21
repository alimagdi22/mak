import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss',
})
export class PaymentModalComponent {
  router = inject(Router);
  translate = inject(TranslateService);

  goToHomePage() {
    this.router.navigate(['/']);
  }
}
