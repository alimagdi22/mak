import { Component, inject, OnDestroy, OnInit } from '@angular/core';
// import { CountryISO } from 'ngx-intl-tel-input-gg';
import { IMainButton } from '../../../../shared/models/mainButton.model';
import { UserProfileService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  isChangePasswordShowed = false;

  isPhoneNumberValid = false;
  // CountryISO = CountryISO;
  genderOptions = ['Male', 'Female'];

  previousButton: IMainButton = {
    title: 'Change Password',
    height: '45px',
    width: 'auto',
    borderRadius: '12px',
  };

  userProfileService = inject(UserProfileService);
  subscription = new Subscription();

  ngOnInit(): void {
    this.userProfileService.initProfileForm();
    this.userProfileService.initChangePasswordForm();

    const user = this.userProfileService.user;

    this.profileForm.controls['firstName'].setValue(user.firstName);
    this.profileForm.controls['lastName'].setValue(user.lastName);
    this.profileForm.controls['userPhoneNumber'].setValue(user.phoneNumber);
    this.profileForm.controls['userPhoneNumber'].disable();

    this.subscription.add(
      this.userProfileService.notify.subscribe({
        next: (status) => {
          if (status === 2) {
            this.isChangePasswordShowed = false;
          } else if (status === 1) {
            // Swal.fire({
            //   icon: 'error',
            //   title: this.translateService.currentLang === 'en' ? "Update Password Didn't Success" : 'لم تنجح العملية'
            // });
          } else if (status === 0) {
            const user = this.userProfileService.user;

            this.profileForm.controls['firstName'].setValue(user.firstName);
            this.profileForm.controls['lastName'].setValue(user.lastName);
            this.profileForm.controls['userPhoneNumber'].setValue(user.phoneNumber);
            this.profileForm.controls['userPhoneNumber'].disable();
          }
        },
      }),
    );
  }

  checkPhoneNumberValidation() {
    if (
      this.profileForm.get('userPhoneNumber')!.invalid &&
      (this.profileForm.get('userPhoneNumber')!.touched || this.profileForm.get('userPhoneNumber')!.dirty)
    ) {
      this.isPhoneNumberValid = true;
    } else {
      this.isPhoneNumberValid = false;
    }
  }

  onSubmit() {
    if (!this.userProfileService.profileForm.invalid) {
      this.userProfileService.editUserProfile();
    }
  }

  onChangePassword() {
    if (!this.userProfileService.changePasswordForm.invalid) {
      this.userProfileService.changePassword();
    }
  }

  canDeactivate(): boolean {
    if ((this.profileForm.dirty || this.changePasswordForm.dirty) && this.isChangePasswordShowed) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }

  get firstName() {
    return this.userProfileService.user.firstName;
  }

  get lastName() {
    return this.userProfileService.user.lastName;
  }

  get email() {
    return this.userProfileService.user.email;
  }

  get phoneNumber() {
    return this.userProfileService.user.phoneNumber;
  }

  get profileForm() {
    return this.userProfileService.profileForm;
  }

  get changePasswordForm() {
    return this.userProfileService.changePasswordForm;
  }

  get isLoading() {
    return this.userProfileService.isLoading;
  }

  get getFirstNameErrorMessage() {
    return this.userProfileService.getFirstNameErrorMessage;
  }

  get getLastNameErrorMessage() {
    return this.userProfileService.getLastNameErrorMessage;
  }

  get getPhoneErrorMessage() {
    return this.userProfileService.getPhoneErrorMessage;
  }

  get getPasswordErrorMessage() {
    return this.userProfileService.getPasswordErrorMessage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
