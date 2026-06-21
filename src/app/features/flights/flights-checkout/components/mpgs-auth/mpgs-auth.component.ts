import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mpgs-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mpgs-auth.component.html',
  styleUrl: './mpgs-auth.component.scss'
})
export class MPGSAuthComponent {
  iframeSrc: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const htmlContent = nav?.extras?.state?.['htmlContent'];

    if (htmlContent) {
      // Create a blob URL to embed the HTML safely
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

}
