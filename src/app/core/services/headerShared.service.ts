import { inject, Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { currencyModel, FlightResultService, HomePageService } from 'rp-travel-ui';

@Injectable({
  providedIn: 'root',
})
export class HeaderSharedService {
  private sharedService = inject(SharedService);
  private homePageService = inject(HomePageService);
private flightResult = inject(FlightResultService);
  updateCurrency(currency: currencyModel) {
    this.homePageService.selectedCurrency = currency;
    let currency_ = currency.Currency_Code.replaceAll('"', ' ');
    sessionStorage.setItem('curr', currency_);
    this.flightResult.updateCurrencyCode(currency.Currency_Code);
  }

  updateLang(lang: 'ar' | 'en') {
    localStorage.setItem('lang', lang);
    location.reload();
  }

  onClickLogin() {
    this.sharedService.userManagementNotifier.next(1);
  }

  onClickRegister() {
    this.sharedService.userManagementNotifier.next(2);
  }
}
