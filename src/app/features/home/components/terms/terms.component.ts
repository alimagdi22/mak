import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HomePageApiService } from 'rp-travel-ui'; // Assuming you have a service for terms
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss',
})
export class TermsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  translate = inject(TranslateService);
  homePageApiService = inject(HomePageApiService);
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  termsContent: string = '';
  termsContentEn: string = '';
  termsContentAr: string = '';

  ngOnInit(): void {
    this.loadTermsContent();
    this.subscription.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateContentLanguage();
      })
    );
  }

  loadTermsContent(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.subscription.add(
      this.homePageApiService.getTerms().subscribe({
        next: (response: any) => {
          if (response.status === 0) {
            this.termsContentEn = response.returnObject?.content || '';
            this.termsContentAr = response.returnObject?.contentArabic || this.termsContentEn;
            this.updateContentLanguage();
          } else {
            this.hasError = true;
            this.errorMessage = response.message || 'Failed to load terms';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.hasError = true;
          this.errorMessage = 'An error occurred while loading terms';
          this.isLoading = false;
          console.error('Error loading terms:', error);
        }
      })
    );
  }

  updateContentLanguage(): void {
    this.termsContent = this.translate.currentLang === 'ar' ? this.termsContentAr : this.termsContentEn;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}