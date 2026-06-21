import { NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService, RESET_PASSWORD_STATUS, UserProfileService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { InputHeaderComponent } from '../../flights-search-box/input-header/input-header.component';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
  standalone: true,
  imports: [TranslatePipe, ReactiveFormsModule, NgStyle, MatProgressSpinnerModule, InputHeaderComponent],
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  dismiss = output<void>();
  login = output<void>();

  translate = inject(TranslateService);

  authService = inject(AuthService);
  userProfileService = inject(UserProfileService);
  route = inject(ActivatedRoute);

  subscription = new Subscription();

  isSuccessfullyReset = false;
  error = false;

  email = '';
  token = '';

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParamMap.subscribe((params) => {
        this.email = params.get('email') ?? '';
        this.token = params.get('token') ? decodeURIComponent(params.get('token')!) : '';

        this.authService.initResetPasswordForm(this.token, this.email);

        if (!this.email || !this.token) {
          this.dismiss.emit();
        }
      }),
    );

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === RESET_PASSWORD_STATUS.success) {
            this.isSuccessfullyReset = true;
          } else if (status === RESET_PASSWORD_STATUS.faild) {
            this.error = true;
          }
        },
      }),
    );

    this.subscription.add(
      this.userProfileService.notify.subscribe({
        next: () => {
          if (
            this.userProfileService.user.email.toLowerCase() !== this.email.toLowerCase() &&
            this.email.toLowerCase()
          ) {
            this.authService.removeToken();
          }
        },
      }),
    );
  }

  onReset() {
    if (this.resetPasswordForm.valid) {
      this.authService.restPassword();
    }
  }

  goToSignIn(e: Event) {
    e.stopPropagation();

    this.login.emit();
  }

  get isLoading() {
    return this.authService.isLoading;
  }

  get resetPasswordForm() {
    return this.authService.resetPasswordForm;
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
  }

  get getPasswordErrorMessage() {
    return this.authService.getPasswordErrorMessage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.authService.isLoading = false;
    this.userProfileService.isLoading = false;
  }
}
