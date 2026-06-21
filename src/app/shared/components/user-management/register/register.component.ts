import { NgStyle } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService, REGISTER_STATUS } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared.service';
import { InputHeaderComponent } from '../../flights-search-box/input-header/input-header.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [TranslatePipe, ReactiveFormsModule, NgStyle, MatProgressSpinnerModule, InputHeaderComponent],
})
export class RegisterComponent {
  dismiss = output<void>();
  login = output<void>();
  otp = output<void>();

  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  authService = inject(AuthService);

  subscription = new Subscription();
  error = false;

  ngOnInit(): void {
    this.authService.initRegisterForm();

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === REGISTER_STATUS.success) {
            this.otp.emit();
          } else {
            this.error = true;
          }
        },
      }),
    );
  }

  onSubmit() {
    this.error = false;
    this.authService.registerForm.markAllAsTouched();

    if (this.authService.registerForm.invalid) {
      this.error = true;
    } else {
      this.authService.regitserSubmit();
    }
  }

  goToSignIn(e: Event) {
    e.stopPropagation();

    this.login.emit();
  }

  get isLoading() {
    return this.authService.isLoading;
  }

  get registerForm() {
    return this.authService.registerForm;
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
  }

  get getFirstNameErrorMessage() {
    return this.authService.getFirstNameErrorMessage;
  }

  get getLastNameErrorMessage() {
    return this.authService.getLastNameErrorMessage;
  }

  get getUserNameErrorMessage() {
    return this.authService.getUserNameErrorMessage;
  }

  get getPhoneErrorMessage() {
    return this.authService.getPhoneErrorMessage;
  }

  get getEmailErrorMessage() {
    return this.authService.getEmailErrorMessage;
  }

  get getPasswordErrorMessage() {
    return this.authService.getPasswordErrorMessage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.authService.isLoading = false;
  }
}
