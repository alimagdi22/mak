import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, Subject, Subscription, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  http = inject(HttpClient);

  contactUsForm: FormGroup = new FormGroup({});

  submissionNotifier: Subject<string> = new Subject();
  subscription = new Subscription();
  isLoading: boolean = false;

  initContactUsForm() {
    const EMAIL_PATTERN =
      /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/;

    this.contactUsForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [
        Validators.email,
        Validators.minLength(8),
        Validators.required,
        Validators.pattern(EMAIL_PATTERN),
      ]),
      emailBody: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
    });
  }

  contactUsSubmission() {
    this.isLoading = true;

    this.subscription.add(
      this.contactUsSubmissionApi(this.contactUsForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;

          if (res.status === 0) {
            this.submissionNotifier.next('success');
          } else {
            this.submissionNotifier.next('faild');
          }
        },
        error: () => {
          this.submissionNotifier.next('faild');
          this.isLoading = false;
        },
      }),
    );
  }

  contactUsSubmissionApi(body: any): Observable<any> {
    let api = '';
    return this.http.post<any>(api, body).pipe(
      take(1),
      catchError((err) => {
        throw err;
      }),
    );
  }
}
