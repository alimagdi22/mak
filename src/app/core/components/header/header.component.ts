import { Component, HostListener, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  AuthService,
  currencyModel,
  FlightResultService,
  HomePageService,
  RESET_PASSWORD_STATUS,
  UserProfileService,
  VERIFY_TOKEN_STATUS,
} from 'rp-travel-ui';
import { filter, Subscription } from 'rxjs';
import { ForgetPasswordComponent } from '../../../shared/components/user-management/forget-password/forget-password.component';
import { LoginComponent } from '../../../shared/components/user-management/login/login.component';
import { OtpComponent } from '../../../shared/components/user-management/otp/otp.component';
import { RegisterComponent } from '../../../shared/components/user-management/register/register.component';
import { ResetPasswordComponent } from '../../../shared/components/user-management/reset-password/reset-password.component';
import { SharedService } from '../../../shared/shared.service';
import { HeaderSharedService } from '../../services/headerShared.service';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../../../shared/services/auth.service';
import { DropDownComponent } from './menu-modal/drop-down/drop-down.component';
import { SignOutAlertModalComponent } from '../../../shared/components/user-management/sign-out-alert-modal/sign-out-alert-modal.component';
import { CommonModule } from '@angular/common';
import { CURRENCY_DEFAULT } from '../../constants/default/currency.default';
import { HomeIcon } from './icons/home-icon.component';
import { PhoneIcon } from './icons/phone-icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    OtpComponent,
    ResetPasswordComponent,
    RouterLink,
    MatMenuModule,
    DropDownComponent,
    SignOutAlertModalComponent,
    HomeIcon,
    PhoneIcon,
    TranslatePipe,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('loginTemplate') loginTemplate!: TemplateRef<any>;
  @ViewChild('registerTemplate') registerTemplate!: TemplateRef<any>;
  @ViewChild('forgetPasswordTemplate') forgetPasswordTemplate!: TemplateRef<any>;

  public sharedService = inject(SharedService);
  public translate = inject(TranslateService);
  public homePageService = inject(HomePageService);
  public flightResultService = inject(FlightResultService);
  public headerSharedService = inject(HeaderSharedService);
  public isScrolled = false;
  public googleAuthService = inject(GoogleAuthService);
  public selectedCurrency: currencyModel = CURRENCY_DEFAULT;

  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  private subscription = new Subscription();
  private email = '';
  private token = '';
  private router = inject(Router);
  isMenuCollapsed = true;
  selectedLang = 'EN';
  isNotInHome = false;
  authenticated = false;

  ngOnInit(): void {
    const storedCurrency = sessionStorage.getItem('curr');
    this.homePageService.getCurrency(storedCurrency || 'EGP');
    this.homePageService.getPointOfSale();
    if (storedCurrency) {
      this.subscription.add(
        this.homePageService.notify.subscribe(() => {
          const currency = this.homePageService.allCurrency.find((c) => c.Currency_Code === storedCurrency);
          if (currency) {
            this.homePageService.selectedCurrency = currency;
          }
        }),
      );
    } else {
      this.homePageService.selectedCurrency = this.selectedCurrency;
    }

    // 🔹 Make sure the page direction matches the language
    this.setDirection(this.translate.currentLang);

    // 🔹 React to language changes
    this.subscription.add(
      this.translate.onLangChange.subscribe((event) => {
        this.setDirection(event.lang);
      }),
    );

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.isNotInHome =
        event.url.includes('flights-results') ||
        event.url.includes('flights-checkout') ||
        event.url.includes('user-management') ||
        event.url.includes('about-us') ||
        event.url.includes('contact-us') ||
        event.url.includes('terms') ||
        event.url.includes('privacy-policy') ||
        event.url.includes('paymentresult');
    });

    this.subscription.add(
      this.sharedService.userManagementNotifier.subscribe({
        next: (userManagementEventStatus) => {
          switch (userManagementEventStatus) {
            case 1:
              this.showModal(this.loginTemplate);
              break;
            case 2:
              this.showModal(this.registerTemplate);
              break;
          }
        },
      }),
    );

    this.subscription.add(
      this.route.queryParamMap.subscribe((params) => {
        this.email = params.get('email') ?? '';
        this.token = params.get('token') ? decodeURIComponent(params.get('token')!) : '';

        if (this.email && this.token) {
          this.showModal(this.forgetPasswordTemplate);
          this.authService.verifyResetPasswordToken(this.token, this.email);
        }
      }),
    );

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === VERIFY_TOKEN_STATUS.faild) {
            console.error('Token is not valid');
            this.modalService.dismissAll();
          }
        },
      }),
    );

    this.subscription.add(
      this.googleAuthService.notify.subscribe({
        next: (status) => {
          if (localStorage.getItem('token')) {
            this.authenticated = true;
            this.userProfileService.getUserProfile();
          } else {
            this.authenticated = false;
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
            this.modalService.dismissAll();
          }
        },
      }),
    );

    if (localStorage.getItem('token')) {
      this.sharedService.isAuthenticated = true;
      this.userProfileService.getUserProfile();
    }

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (localStorage.getItem('token')) {
            this.userProfileService.getUserProfile();
            this.sharedService.isAuthenticated = true;
          } else if (status === RESET_PASSWORD_STATUS.success) {
            // Swal.fire({
            //   icon: 'success',
            //   title: this.translate.currentLang === 'en' ? 'Password Updated Successfully' : 'تم تحديث كلمة السر بنجاج'
            // });
          } else {
            this.sharedService.isAuthenticated = false;
          }
        },
      }),
    );
  }

  private setDirection(lang: string) {
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }

  showModal(template: TemplateRef<any>) {
    this.modalService.dismissAll();
    this.modalService.open(template, {
      fullscreen: this.sharedService.screenWidth < this.sharedService.webViewBreakPoint,
      centered: this.sharedService.screenWidth >= this.sharedService.webViewBreakPoint,
    });
  }

  get userName() {
    return this.userProfileService.user.firstName + ' ' + this.userProfileService.user.lastName;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('flights-results') || currentUrl.includes('flights-checkout')) {
      this.isScrolled = false;
      return;
    }
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
