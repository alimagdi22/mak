import { NgStyle } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthService, OTP_STATUS } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { InputHeaderComponent } from '../../flights-search-box/input-header/input-header.component';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
  standalone: true,
  imports: [TranslatePipe, NgStyle, NgOtpInputModule, InputHeaderComponent],
})
export class OtpComponent {
  dismiss = output<void>();

  authService = inject(AuthService);
  subscription = new Subscription();

  error = false;

  ngOnInit(): void {
    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === OTP_STATUS.success) {
            this.dismiss.emit();
          } else {
            this.error = true;
          }
        },
      }),
    );
  }

  onOtpChange(otp: string) {
    if (otp.length === 6) {
      this.authService.otpSubmit(otp);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.authService.isLoading = false;
  }
}
