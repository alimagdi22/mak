import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HomePageApiService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent implements OnInit, OnDestroy {
  selectedTab: string = 'flights';
  private subscription = new Subscription();
  homePageApiService = inject(HomePageApiService);
  translate = inject(TranslateService);
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  cmsContent: string = '';
  cmsContentEn: string = '';
  cmsContentAr: string = '';

  ngOnInit(): void {
    this.loadAboutUsContent();
    // Watch for language changes
    this.subscription.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateContentLanguage();
      })
    );
  }

  loadAboutUsContent(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.subscription.add(
      this.homePageApiService.getAboutUs().subscribe({
        next: (response: any) => {
          if (response.status === 0) {
            this.cmsContentEn = response.returnObject?.content || '';
            this.cmsContentAr = response.returnObject?.contentArabic || this.cmsContentEn;
            this.updateContentLanguage();
          } else {
            this.hasError = true;
            this.errorMessage = response.message || 'Failed to load content';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.hasError = true;
          this.errorMessage = 'An error occurred while loading content';
          this.isLoading = false;
          console.error('Error loading about us content:', error);
        }
      })
    );
  }

  updateContentLanguage(): void {
    this.cmsContent = this.translate.currentLang === 'ar' ? this.cmsContentAr : this.cmsContentEn;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}