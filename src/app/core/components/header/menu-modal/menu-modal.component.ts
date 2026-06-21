import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DropDownComponent } from './drop-down/drop-down.component';
import { HeaderSharedService } from '../../../services/headerShared.service';
import { SharedService } from '../../../../shared/shared.service';
import { AuthApiService, AuthService, GoogleAuthResponse } from 'rp-travel-ui';
import { from, Subscription, switchMap } from 'rxjs';
import { GoogleAuthService } from '../../../../shared/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-modal',
  standalone: true,
  imports: [TranslatePipe, DropDownComponent, RouterLink],
  templateUrl: './menu-modal.component.html',
  styleUrl: './menu-modal.component.scss',
})
export class MenuModalComponent {
  public sharedService = inject(SharedService);
  public headerSharedService = inject(HeaderSharedService);


  translate = inject(TranslateService);
  authService = inject(AuthService);
  subscription = new Subscription();
  AuthApiService = inject(AuthApiService);
  public googleAuthService = inject(GoogleAuthService);
  private auth = inject(Auth);
  router = inject(Router);







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
}
}