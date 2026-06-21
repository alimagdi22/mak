import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as countries from 'world-countries';
import { SharedService } from '../../../../../../../shared/shared.service';
import { FlightCheckoutService } from 'rp-travel-ui';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input-gg';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent implements OnInit {
  contactForm!: FormGroup;
  countryList: any[] = [];
  translate = inject(TranslateService);
  selectedCountryCode: string = 'EG';
  public flightCheckoutService = inject(FlightCheckoutService);
  public sharedService = inject(SharedService);
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  isPhoneNumberInvalid: boolean = false;
  fieldErrors: { [fieldName: string]: string } = {};
  
  // Track field interaction state
  fieldTouched: { [fieldName: string]: boolean } = {
    email: false,
    phone: false
  };

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: ['', [
        Validators.required, 
        this.emailValidator()
      ]],
      phone: ['', [
        Validators.required,
        this.phoneValidator()
      ]],
      country: ['EG', Validators.required],
      countryCode: ['20'],
    });

    this.countryList = countries.default.map((country: any) => ({
      name: country.name.common,
      code: country.cca2,
      dialCode: country.idd.root + (country.idd.suffixes?.[0] || ''),
      flag: `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`,
    }));

    this.sharedService.contactForm = this.contactForm;
    this.updateSharedService();

    this.sharedService.submitTrigger$.subscribe(() => {
      // Trim email and phone values before validation
      const emailControl = this.contactForm.get('email');
      if (emailControl && typeof emailControl.value === 'string') {
        const trimmedEmail = emailControl.value.trim();
        if (trimmedEmail !== emailControl.value) {
          emailControl.setValue(trimmedEmail, { emitEvent: false });
          emailControl.updateValueAndValidity();
        }
      }

      const phoneControl = this.contactForm.get('phone');
      if (phoneControl && typeof phoneControl.value === 'object' && phoneControl.value?.number) {
        const trimmedNumber = phoneControl.value.number.trim();
        if (trimmedNumber !== phoneControl.value.number) {
          phoneControl.setValue({
            ...phoneControl.value,
            number: trimmedNumber
          }, { emitEvent: false });
          phoneControl.updateValueAndValidity();
        }
      }

      // Mark all controls in the form as touched
      Object.keys(this.contactForm.controls).forEach(field => {
        const control = this.contactForm.get(field);
        if (control) {
          control.markAsTouched();
          control.markAsDirty();
          if (this.fieldTouched.hasOwnProperty(field)) {
            this.fieldTouched[field] = true;
          }
          this.updateFieldError(field);
        }
      });
      this.cdRef.detectChanges();
    });

    // Track email validation
    this.contactForm.get('email')?.valueChanges.subscribe(() => {
      this.updateFieldError('email');
    });

    // Track phone validation
    this.contactForm.get('phone')?.valueChanges.subscribe(() => {
      this.updateFieldError('phone');
      this.checkPhoneNumberValidation();
    });

    this.contactForm.valueChanges.subscribe(() => {
      if (this.contactForm.valid) {
        this.updateSharedService();
      }
    });
  }

  // Custom email validator that validates the trimmed value
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }
      
      const trimmedValue = typeof control.value === 'string' ? control.value.trim() : control.value;
      
      // Use standard email regex pattern
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!emailPattern.test(trimmedValue)) {
        return { email: true };
      }
      
      return null;
    };
  }

  private getTranslatedErrorMessage(errorKey: string, fieldName: string): string {
    const errorMessages: any = {
      required: 'checkout.ERRORS.REQUIRED',
      email: 'checkout.ERRORS.EMAIL',
      invalidPhone: 'checkout.ERRORS.INVALID_PHONE'
    };

    const translationKey = errorMessages[errorKey] || 'checkout.ERRORS.PATTERN';
    return this.translate.instant(translationKey, { fieldName });
  }

  updateFieldError(fieldName: string): void {
    const field = this.contactForm.get(fieldName);
    if (!field) return;

    const errors = field.errors || {};
    
    // Clear previous error
    delete this.fieldErrors[fieldName];
    
    // Only show errors if field is touched and invalid
    if (field.invalid && this.fieldTouched[fieldName]) {
      // Check for specific errors in order of priority
      if (errors['required']) {
        this.fieldErrors[fieldName] = this.getTranslatedErrorMessage('required', fieldName);
      } else if (errors['email']) {
        this.fieldErrors[fieldName] = this.getTranslatedErrorMessage('email', fieldName);
      } else if (errors['invalidPhone']) {
        this.fieldErrors[fieldName] = this.getTranslatedErrorMessage('invalidPhone', fieldName);
      }
    }
  }

  onEmailInput(event: any): void {
    this.updateFieldError('email');
  }

  markFieldTouched(fieldName: string): void {
    this.fieldTouched[fieldName] = true;
    const field = this.contactForm.get(fieldName);
    if (field) {
      field.markAsTouched();
    }
  }

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { required: true };
      }
      
      // Check if it's an object from ngx-intl-tel-input
      if (typeof control.value === 'object' && control.value !== null) {
        const phoneObj = control.value as any;
        const number = String(phoneObj.number || '');
        if (!phoneObj.number || number.trim().length < 5) {
          return { invalidPhone: true };
        }
      } else if (typeof control.value === 'string') {
        const phoneStr = control.value.trim();
        const phonePattern = /^[\d\+\-\s\(\)]{5,20}$/;
        if (!phonePattern.test(phoneStr)) {
          return { invalidPhone: true };
        }
      }
      
      return null;
    };
  }

  getFieldError(fieldName: string): string {
    return this.fieldErrors[fieldName] || '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    // Only show as invalid if the field has been touched
    return !!(field?.invalid && this.fieldTouched[fieldName]);
  }

  // Handle country change from ngx-intl-tel-input
  onPhoneNumberChange(event: any) {
    if (event && event.countryCode) {
      this.selectedCountryCode = event.countryCode;
      const dialCode = event.dialCode.replace('+', '');

      this.contactForm.patchValue(
        {
          country: event.countryCode,
          countryCode: dialCode,
        },
        { emitEvent: false },
      );

      if (this.contactForm.valid) {
        this.updateSharedService();
      }
    }
  }

  // Handle country change from old dropdown
  onCountryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const countryCode = selectElement.value;
    this.selectedCountryCode = countryCode;

    const selectedCountry = this.countryList.find((c) => c.code === countryCode);
    const dialCode = selectedCountry?.dialCode?.replace('+', '') || '20';

    this.contactForm.patchValue({
      country: countryCode,
      countryCode: dialCode,
    });

    if (this.contactForm.valid) {
      this.updateSharedService();
    }
  }

  private updateSharedService(): void {
    const { email, phone, country, countryCode } = this.contactForm.value;
    this.sharedService.email = email;
    this.sharedService.phoneNumber = phone;
    this.sharedService.country = country;
    this.sharedService.countryCode = countryCode;
    const contactData = {
      email,
      phone,
      country,
      countryCode,
    };
    sessionStorage.setItem('contactDetails', JSON.stringify(contactData));
  }

  checkPhoneNumberValidation() {
    const phoneControl = this.contactForm.get('phone');
    this.isPhoneNumberInvalid = !!(phoneControl?.invalid && this.fieldTouched['phone']);
  }
  
  // Handle blur event for both fields
  onFieldBlur(fieldName: string): void {
    this.markFieldTouched(fieldName);
    this.updateFieldError(fieldName);
  }
}