import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { currencyModel, FlightResultService, HomePageService } from 'rp-travel-ui';
import { CURRENCY_DEFAULT } from '../../../constants/default/currency.default';
import { SharedService } from '../../../../shared/shared.service';
import { HeaderSharedService } from '../../../services/headerShared.service';

@Component({
  selector: 'app-global-modal',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatRadioModule, FormsModule, TranslatePipe],
  templateUrl: './global-modal.component.html',
  styleUrl: './global-modal.component.scss',
})
export class GlobalModalComponent implements OnInit {
  @ViewChild('currencyMenuTrigger') currencyMenuTrigger!: MatMenuTrigger;

  public translate = inject(TranslateService);
  public homePageService = inject(HomePageService);
  public sharedService = inject(SharedService);
  public selectLang: 'en' | 'ar' = 'en';
  public isLanguageChanged = false;
  public selectedCurrency: currencyModel = CURRENCY_DEFAULT;

  private headerSharedService = inject(HeaderSharedService);

  ngOnInit(): void {
    this.selectLang = this.translate.currentLang as 'en' | 'ar';
    this.selectedCurrency = this.homePageService.selectedCurrency;
  }

  updateCurrency(currency: currencyModel) {
    this.headerSharedService.updateCurrency(currency);
    this.currencyMenuTrigger.closeMenu();
    this.sharedService.closeModals();
  }

  onClickUpdate() {
    if (this.isLanguageChanged) {
      this.headerSharedService.updateLang(this.selectLang);
    }
  }
}
