import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {  HomePageApiService } from 'rp-travel-ui'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  translate = inject(TranslateService);
  homePageApiService = inject(HomePageApiService);
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  policyContent: string = '';
  policyContentEn: string = '';
  policyContentAr: string = '';

  ngOnInit(): void {
    this.loadPrivacyPolicy();
    this.subscription.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateContentLanguage();
      })
    );
  }

  loadPrivacyPolicy(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.subscription.add(
      this.homePageApiService.getPrivacyPolicy().subscribe({
        next: (response: any) => {
          if (response.status === 0) {
            this.policyContentEn = response.returnObject?.content || '';
            this.policyContentAr = response.returnObject?.contentArabic || this.policyContentEn;
            this.updateContentLanguage();
          } else {
            this.hasError = true;
            this.errorMessage = response.message || 'Failed to load privacy policy';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.hasError = true;
          this.errorMessage = 'An error occurred while loading privacy policy';
          this.isLoading = false;
          console.error('Error loading privacy policy:', error);
        }
      })
    );
  }

  updateContentLanguage(): void {
    this.policyContent = this.translate.currentLang === 'ar' ? this.policyContentAr : this.policyContentEn;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}