import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../../../../shared/shared.service';
import { AuthApiService, AuthService, GoogleAuthResponse, LOGIN_STATUS } from 'rp-travel-ui';
import { from, Subscription, switchMap } from 'rxjs';
import { GoogleAuthService } from '../../../../../../../shared/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-section',
  templateUrl: './login-section.component.html',
  styleUrl: './login-section.component.scss',
})
export class LoginSectionComponent implements OnInit, OnDestroy {
  public translate = inject(TranslateService);
  currentLang = this.translate.currentLang;
  public sharedService = inject(SharedService);
  authService = inject(AuthService);
  AuthApiService = inject(AuthApiService);
  googleAuthService = inject(GoogleAuthService);
  private auth = inject(Auth);
  router = inject(Router);
  
  showLoginForm = false;
  error = false;
  private subscription = new Subscription();

  ngOnInit(): void {
    this.authService.initLoginForm();

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === LOGIN_STATUS.success) {
            this.showLoginForm = false;
            this.error = false;
          } else if (status === LOGIN_STATUS.faild) {
            this.error = true;
          }
        },
      }),
    );
  }

  toggleLoginForm(): void {
    this.showLoginForm = !this.showLoginForm;
    this.error = false;
    if (this.showLoginForm) {
      this.authService.initLoginForm();
    }
  }

  onSubmit(): void {
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

  googleLoginSubmit(): void {
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
            this.showLoginForm = false;
            this.router.navigate(['/']);
          } else {
            console.error('Login Failed:', res);
            this.error = true;
          }
        },
        error: (error) => {
          console.error('Google Login Submit Error:', error);
          this.error = true;
        },
      });
  }

  loginWithFacebook(): void {
    // Facebook login implementation
    // You can add the same Facebook login logic from your login component here
  }

  goToRestPassword(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    // Add reset password logic here or emit an event
  }

  goToSignUp() {
    this.sharedService.userManagementNotifier.next(2);
  }

  get isLoading(): boolean {
    return this.authService.isLoading;
  }

  get loginForm(): any {
    return this.authService.loginForm;
  }

  get getEmailErrorMessage(): any {
    return this.authService.getEmailErrorMessage;
  }

  get getPasswordErrorMessage(): any {
    return this.authService.getPasswordErrorMessage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.authService.isLoading = false;
  }
}