import { NgStyle } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthApiService, AuthService, GoogleAuthResponse, LOGIN_STATUS } from 'rp-travel-ui';
import { from, Subscription, switchMap } from 'rxjs';
import { InputHeaderComponent } from '../../flights-search-box/input-header/input-header.component';
import { GoogleAuthService } from '../../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared.service';
declare const FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [TranslatePipe, ReactiveFormsModule, NgStyle, MatProgressSpinnerModule, InputHeaderComponent],
})
export class LoginComponent {
  dismiss = output<void>();
  register = output<void>();
  resetPassword = output<void>();

  translate = inject(TranslateService);
  public sharedService = inject(SharedService);
  authService = inject(AuthService);
  subscription = new Subscription();
  AuthApiService = inject(AuthApiService);
  public googleAuthService = inject(GoogleAuthService);
  private auth = inject(Auth);
  router = inject(Router);
  error: boolean = false;

  ngOnInit(): void {
    this.authService.initLoginForm();

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === LOGIN_STATUS.success) {
            this.dismiss.emit();
          } else if (status === LOGIN_STATUS.faild) {
            this.error = true;
          }
        },
      }),
    );
  }

  loginWithFacebook(): void {
    FB.login((response: any) => {
      if (response.authResponse) {
        FB.api('/me', { fields: 'id,name,first_name,last_name,email,picture,birthday,gender,location,link,hometown,locale,timezone,updated_time,verified' }, (userInfo: any) => {
        });
      } else {
        console.error('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'email,public_profile' });
  }

  onSubmit() {
    this.error = false;
    if (this.authService.loginForm.invalid) {
      this.error = true;
    } else {
      this.authService.loginSubmit();
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  googleLoginSubmit() {
    from(this.googleAuthService.loginWithGoogle())
      .pipe(
        switchMap((idToken: any) => {
          const userData = this.decodeToken(idToken);
          const body: GoogleAuthResponse = {
            iss: userData.iss,
            azp: userData.azp,
            aud: userData.aud,
            sub: userData.sub ? userData.name.replace(/\s+/g, '') : '',
            hd: userData.hd,
            email: userData.email,
            email_verified: userData.email_verified,
            nbf: userData.nbf,
            name: userData.name ? userData.name.replace(/\s+/g, '') : '',
            picture: userData.picture,
            given_name: userData.given_name,
            family_name: userData.family_name,
            iat: userData.iat,
            exp: userData.exp,
            jti: userData.jti,
          };

          this.googleAuthService.bindUserData(userData);
          return this.AuthApiService.googleLogin(body);
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.status === 0) {
            localStorage.setItem('token', JSON.stringify(res.returnObject.token));
            this.googleAuthService.notify.next('askdflj');
            this.authService.notify.next('login');
            this.dismiss.emit();
            this.router.navigate(['/']);
          } else {
            console.error('Login Failed:', res);
          }
        },
        error: (error) => {
          console.error('Google Login Submit Error:', error);
        },
      });
  }
  handleGoogleSignIn(response: any) {
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    const userData = JSON.parse(jsonPayload);
    this.googleAuthService.bindUserData(userData);
    this.authService.googleLoginSubmit(userData);
  }

  goToSignUp(e: Event) {
    e.stopPropagation();

    this.register.emit();
  }

  goToRestPassword(e: Event) {
    e.stopPropagation();

    this.resetPassword.emit();
  }

  get isLoading() {
    return this.authService.isLoading;
  }

  get loginForm() {
    return this.authService.loginForm;
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
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
