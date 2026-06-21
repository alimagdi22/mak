import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ContactUsService } from './services/contact-us.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, MatProgressSpinnerModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  subscription = new Subscription();
  translate = inject(TranslateService);
  contactUsService = inject(ContactUsService);
  router = inject(Router);

  ngOnInit() {
    this.contactUsService.initContactUsForm();

    this.subscription.add(
      this.contactUsService.submissionNotifier.subscribe({
        next: (status) => {
          if (status === 'success') {
            Swal.fire({
              icon: 'success',
              title: this.translate.currentLang === 'en' ? 'Message Sent Successfully' : 'تم إرسال الرسالة بنجاح',
              text:
                this.translate.currentLang === 'en'
                  ? 'Thank you! We will contact you via email shortly.'
                  : 'شكرًا لك! سنتواصل معك عبر البريد الإلكتروني قريبًا.',
            });

            this.router.navigate(['/']);
          } else {
            Swal.fire({
              icon: 'error',
              title: this.translate.currentLang === 'en' ? 'Message Not Sent' : 'لم يتم إرسال الرسالة',
              text: this.translate.currentLang === 'en' ? 'Please try again later.' : 'يرجى المحاولة مرة أخرى لاحقًا.',
            });

            this.contactUsForm.reset();
          }
        },
      }),
    );
  }

  get contactUsForm() {
    return this.contactUsService.contactUsForm;
  }

  get isLoading() {
    return this.contactUsService.isLoading;
  }

  isFormControllerInvaild(controller: string) {
    return this.contactUsForm.get(controller)?.touched && this.contactUsForm.get(controller)?.invalid;
  }

  onSubmit() {
    if (this.contactUsForm.valid) {
      this.contactUsService.contactUsSubmission();
    }
  }
}
