import { NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService, FORGET_PASSWORD_STATUS } from 'rp-travel-ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  standalone: true,
  imports: [TranslatePipe, ReactiveFormsModule, NgStyle, MatProgressSpinnerModule],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  login = output<void>();

  translate = inject(TranslateService);
  authService = inject(AuthService);
  subscription = new Subscription();

  isSuccessfullySent = false;
  error = false;

  ngOnInit(): void {
    this.authService.initForgetPasswordForm();

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === FORGET_PASSWORD_STATUS.success) {
            this.isSuccessfullySent = true;
          } else if (status === FORGET_PASSWORD_STATUS.faild) {
            this.error = true;
          }
        },
      }),
    );
  }

  onSubmit() {
    this.authService.forgetPassword();
  }

  goToSignIn(e: Event) {
    e.stopPropagation();

    this.login.emit();
  }

  resendEmail(e: Event) {}

  get isLoading() {
    return this.authService.isLoading;
  }

  get forgetPasswordForm() {
    return this.authService.forgetPasswordForm;
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
  }

  get getEmailErrorMessage() {
    return this.authService.getEmailErrorMessage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.authService.isLoading = false;
  }
}
