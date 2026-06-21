import { ChangeDetectorRef, Component, inject, Input, OnInit, ViewChildren, OnDestroy, AfterViewInit, ElementRef, QueryList } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FlightCheckoutService, HomePageService, selectedFlight } from 'rp-travel-ui';
import { SharedService } from '../../../../../../../shared/shared.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { IGetSelectedFlight } from '../../../../../../../core/models/model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ContactDetails } from '../../../../../../../core/models/contactDetails.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CountrySelectionModalComponent } from './country-selection-modal/country-selection-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-travellers-details',
  templateUrl: './travellers-details.component.html',
  styleUrls: ['./travellers-details.component.scss'],
})
export class TravellersDetailsComponent implements OnInit,AfterViewInit, OnDestroy {
  @ViewChildren(MatExpansionPanel) expansionPanels!: MatExpansionPanel[];
  @ViewChildren('travellerPanel', { read: ElementRef }) panels!: QueryList<ElementRef>;
  private flightCheckoutService = inject(FlightCheckoutService);
  public sharedService = inject(SharedService);
  public homePageService = inject(HomePageService);
  public translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  usersForm!: FormGroup;
  isFormReady = false;
  invalidPanelIndices: number[] = [];
  passengerCount = 0;
  filteredCountries: { [index: number]: any[] } = {};
  departureDate: string = '0000-00-00';
  isExpanded: boolean = false;
  flightData?: selectedFlight;
  private destroy$ = new Subject<void>();

  private readonly SESSION_STORAGE_FLIGHT_PREFIX = 'flightData_';
  searchParams: any;
  currentExpandedIndex = 0;
  minDates: NgbDateStruct[] = [];
  maxDates: NgbDateStruct[] = [];

  contact?: ContactDetails;
  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.searchParams = {
        searchId: params['sid']?.split('_')[0],
        sequenceNum: +params['sequenceNum'],
        providerKey: params['providerKey'] || params['pkey'],
        pcc: params['sid']?.split('_')[1],
      };
      this.initializeForm();
      this.loadContactDataToForm();
    });

    this.sharedService.submitTrigger$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.onSubmit();
    });
    this.initializeFilteredCountries();

    for (let i = 0; i < this.usersArray.length; i++) {
      this.minDates[i] = this.getMinDatepickerDate(
        this.departureDate,
        this.getPassengerForm(i).get('PassengerType')?.value,
      );
      this.maxDates[i] = this.getMaxDatepickerDate(
        this.departureDate,
        this.getPassengerForm(i).get('PassengerType')?.value,
      );
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const el = this.panels.toArray()[this.currentExpandedIndex]?.nativeElement;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  private filterCountries(value: string): any[] {    
    if (!value) {
      return [...this.homePageService.allCountries];
    }
    const filterValue = value.toLowerCase();
    const currentLang = this.translate.currentLang;
    
    // First, try to filter in the current language
    let filtered = this.homePageService.allCountries.filter((option) => 
      option.countryName.toLowerCase().includes(filterValue)
    );
    
    // If no results found and we have the opposite language data, search there
    if (filtered.length === 0 && this.homePageService.allEnCountries && this.homePageService.allEnCountries.length > 0) {
      // Search in opposite language array
      const oppositeFiltered = this.homePageService.allEnCountries.filter((option) =>
        option.countryName.toLowerCase().includes(filterValue)
      );
      
      // Map back to current language using pseudoCountryCode and phoneCode
      if (oppositeFiltered.length > 0) {
        filtered = oppositeFiltered.map((oppositeCountry) => {
          // Find matching country in current language by pseudoCountryCode or phoneCode
          return this.homePageService.allCountries.find((currentCountry) =>
            currentCountry.pseudoCountryCode === oppositeCountry.pseudoCountryCode ||
            (currentCountry.phoneCode === oppositeCountry.phoneCode && oppositeCountry.phoneCode)
          );
        }).filter((country): country is any => country !== undefined); // Remove any undefined results
      }
    }
    
    return filtered;
  }

  private areRequiredFieldsValid(index: number): boolean | undefined {
    if (this.sharedService.screenWidth > this.sharedService.webViewBreakPoint) {
      return false;
    }

    const passengerForm = this.getPassengerForm(index);
    return (
      passengerForm.get('title')?.valid &&
      passengerForm.get('firstName')?.valid &&
      passengerForm.get('lastName')?.valid &&
      passengerForm.get('birthDate')?.valid
    );
  }

  private checkAndOpenPanel(index: number): void {
    if (this.sharedService.screenWidth <= this.sharedService.webViewBreakPoint && this.areRequiredFieldsValid(index)) {
      this.isExpanded = true;
      this.cdRef.detectChanges();
    }
  }

  getInitialFocusDate(passengerType: string): NgbDateStruct {
    if (passengerType === 'ADT') {
      return { year: 1990, month: 1, day: 1 };
    }
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  displayCountry(countryName: string): string {
    if (!countryName) return '';
    const country = this.homePageService.allCountries.find((c) => c.countryName === countryName);
    return country ? country.countryName : countryName;
  }

  openCountrySelection(index: number): void {
    const dialogRef = this.dialog.open(CountrySelectionModalComponent, {
      width: '100%',
      maxWidth: '100vw',
      height: '100%',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: {
        countries: this.homePageService.allCountries,
        oppositeCountries: this.homePageService.allEnCountries,
        currentCountry: this.getPassengerForm(index).get('countryName')?.value,
      },
    });

    dialogRef.afterClosed().subscribe((selectedCountry) => {
      if (selectedCountry) {
        const passengerForm = this.getPassengerForm(index);
        passengerForm.get('countryName')?.setValue(selectedCountry.countryName);
        passengerForm.get('IssuedCountry')?.setValue(selectedCountry.countryName);
        passengerForm.get('isIssuedCountrySelected')?.setValue(true);

        // Force update the UI
        this.cdRef.detectChanges();

        // Manually trigger validation
        passengerForm.get('countryName')?.markAsTouched();
        passengerForm.get('countryName')?.updateValueAndValidity();
      }
    });
  }

  onIssuedCountrySelected(event: MatAutocompleteSelectedEvent, index: number): void {
    const selectedCountryName = event.option.value;
    const selectedCountry = this.homePageService.allCountries.find((c) => c.countryName === selectedCountryName);

    if (selectedCountry) {
      const passengerForm = this.getPassengerForm(index);
      passengerForm.get('countryName')?.setValue(selectedCountry.countryName);
      passengerForm.get('IssuedCountry')?.setValue(selectedCountry.countryName);
      this.filteredCountries[index] = this.filterCountries(selectedCountry.countryName);

      passengerForm.get('countryName')?.markAsTouched();
      passengerForm.get('isIssuedCountrySelected')?.setValue(true);
      passengerForm.get('countryName')?.updateValueAndValidity();
    }
  }

  private getFlightDataKey(prefix: string, searchId: string, sequenceNum: number, providerKey: string): string {
    return `${prefix}${searchId}_${sequenceNum}_${providerKey}`;
  }

  private getFlightDataFromSession(): any {
    const flightKey = this.getFlightDataKey(
      this.SESSION_STORAGE_FLIGHT_PREFIX,
      this.searchParams.searchId,
      this.searchParams.sequenceNum,
      this.searchParams.providerKey,
    );
    const flightData = sessionStorage.getItem(flightKey);
    return flightData ? JSON.parse(flightData) : null;
  }

  private initializeFilteredCountries(): void {
    if (this.homePageService.allCountries.length > 0) {
      sessionStorage.setItem('all-countries', JSON.stringify(this.homePageService.allCountries));
    } else if (sessionStorage.getItem('all-countries')) {
      const allCountries = sessionStorage.getItem('all-countries');
      if (allCountries) {
        this.homePageService.allCountries = JSON.parse(allCountries);
      }
    }

    this.filteredCountries = {};

    for (let i = 0; i < this.passengerCount; i++) {
      this.filteredCountries[i] = [...this.homePageService.allCountries];

      const passengerForm = this.getPassengerForm(i);

      passengerForm
        .get('countryName')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.filteredCountries[i] = this.filterCountries(value);
          this.cdRef.markForCheck();
        });

      passengerForm.get('PassportExpiry')?.updateValueAndValidity();
    }
  }

  datepickerConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'YYYY-MM-DD',
    containerClass: 'theme-default',
    isAnimated: true,
    showWeekNumbers: false,
  };

  private initializeForm(): void {
    this.flightData = this.getFlightDataFromSession();
    if (!this.flightData) {
      return;
    }

    this.usersForm = this.flightCheckoutService.usersForm;

    const adultNum = Number(this.flightData.searchCriteria.adultNum) || 0;
    const childNum = Number(this.flightData.searchCriteria.childNum) || 0;
    const infantNum = Number(this.flightData.searchCriteria.infantNum) || 0;

    this.passengerCount = adultNum + childNum + infantNum;
    this.departureDate = this.flightData.searchCriteria.flights[0].departingOnDate;

    this.flightCheckoutService.buildUsersForm(adultNum, childNum, infantNum, true, false);

    this.initializeFilteredCountries();

    for (let i = 0; i < this.passengerCount; i++) {
      const passengerForm = this.getPassengerForm(i);
      passengerForm.addControl('birthDate', new FormControl(''));
      passengerForm.addControl('PassportExpiration', new FormControl(''));
      passengerForm.addControl('countryName', new FormControl('', [Validators.required, this.countryValidator()]));

      passengerForm.get('birthDate')?.setValidators(Validators.required);
      passengerForm
        .get('PassportExpiration')
        ?.setValidators([Validators.required, this.passportExpiryValidator(this.departureDate)]);

      passengerForm
        .get('birthDate')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value: NgbDateStruct) => {
          if (value) {
            passengerForm.get('dateOfBirth')?.setValue(this.formatNgbDate(value));
          }
        });

      passengerForm
        .get('PassportExpiration')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value: NgbDateStruct) => {
          if (value) {
            passengerForm.get('PassportExpiry')?.setValue(this.formatNgbDate(value));
          }
        });

      passengerForm
        .get('title')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => this.checkAndOpenPanel(i));

      passengerForm
        .get('firstName')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => this.checkAndOpenPanel(i));

      passengerForm
        .get('lastName')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => this.checkAndOpenPanel(i));

      passengerForm
        .get('birthDate')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          const dob = passengerForm.get('birthDate')?.value;
          if (dob && dob.year) {
            passengerForm.get('dateOfBirth')?.setValue(this.formatNgbDate(dob));
          }
          this.checkAndOpenPanel(i);
        });

      passengerForm.get('countryName')?.updateValueAndValidity();
    }

    this.setSharedServiceValuesToAllForms();
    this.isFormReady = true;
    this.cdRef.detectChanges();
  }

  getMinPassportExpiryDateObj(): NgbDateStruct {
    let baseDate = new Date();

    // if (this.departureDate) {
    //   try {
    //     const depDateStr = this.departureDate.split('T')[0];
    //     baseDate = new Date(depDateStr);
    //   } catch (e) {
    //     console.error('Error parsing departureDate', e);
    //   }
    // }

    // baseDate.setMonth(baseDate.getMonth() + 3);

    return {
      year: baseDate.getFullYear(),
      month: baseDate.getMonth() + 1,
      day: baseDate.getDate(),
    };
  }

  getMinDatepickerDate(departureDate: string, passengerType: string): NgbDateStruct {
    const depDate = new Date(departureDate);
    let targetDate: Date;

    switch (passengerType) {
      case 'ADT':
        targetDate = this.subtractYears(depDate, 100);
        break;
      case 'CNN':
        targetDate = this.subtractYears(depDate, 12);
        break;
      case 'CHD':
        targetDate = this.subtractYears(depDate, 12);
        break;
      case 'INF':
        targetDate = this.subtractYears(depDate, 2);
        break;
      default:
        targetDate = new Date();
    }

    return this.toNgbDateStruct(targetDate);
  }

  getMaxDatepickerDate(departureDate: string, passengerType: string): NgbDateStruct {
    const depDate = new Date(departureDate);
    let targetDate: Date;

    switch (passengerType) {
      case 'ADT':
        targetDate = this.subtractYears(depDate, 12);
        break;
      case 'CNN':
        targetDate = this.subtractYears(depDate, 2);
        break;
      case 'CHD':
        targetDate = this.subtractYears(depDate, 2);
        break;
      case 'INF':
        targetDate = depDate;
        break;
      default:
        targetDate = new Date();
    }

    return this.toNgbDateStruct(targetDate);
  }

  toNgbDateStruct(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  togglePanel() {
    this.isExpanded = !this.isExpanded;
  }

  subtractYears(date: Date, years: number): Date {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() - years);
    return newDate;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
  }

  passportExpiryValidator(departureDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { required: true };
      }

      try {
        let expiryDate: Date;

        if (typeof control.value === 'string') {
          expiryDate = new Date(control.value);
        } else {
          expiryDate = new Date(control.value.year, control.value.month - 1, control.value.day);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // const depDateStr = departureDate.split('T')[0];
        // const depDate = new Date(depDateStr);
        // const minExpiryDate = new Date(depDate);
        // minExpiryDate.setMonth(minExpiryDate.getMonth() + 3);


        //set to minExpiryDate if u want to use the validation 
        if (expiryDate < today) {
          return {
            passportExpiryTooSoon: {
              requiredDate: this.formatDate(today),
              // departureDate: this.formatDate(depDate),
            },
          };
        }

        return null;
      } catch (e) {
        console.error('Error validating passport expiry date', e);
        return { invalidDate: true };
      }
    };
  }

  private setSharedServiceValuesToAllForms(): void {
    for (let i = 0; i < this.usersArray.length; i++) {
      const passengerForm = this.getPassengerForm(i);

      if (this.sharedService.email && passengerForm.get('email')) {
        passengerForm.get('email')?.setValue(this.sharedService.email);
        passengerForm.get('email')?.markAsDirty();
      }

      if (this.sharedService.phoneNumber && passengerForm.get('phoneNumber')) {
        passengerForm.get('phoneNumber')?.setValue(this.sharedService.phoneNumber);
        passengerForm.get('phoneNumber')?.markAsDirty();
      }

      if (this.sharedService.country && passengerForm.get('countryCode')) {
        passengerForm.get('nationality')?.setValue(this.sharedService.country);
        passengerForm.get('nationality')?.markAsDirty();
      }

      if (this.sharedService.country && passengerForm.get('countryName')) {
        passengerForm.get('IssuedCountry')?.setValue(passengerForm.get('countryName')?.value);
        passengerForm.get('IssuedCountry')?.markAsDirty();
      }

      if (this.sharedService.country && passengerForm.get('countryCode')) {
        passengerForm.get('countryOfResidence')?.setValue(passengerForm.get('IssuedCountry')?.value);
        passengerForm.get('countryOfResidence')?.markAsDirty();
      }

      if (this.sharedService.countryCode && passengerForm.get('countryCode')) {
        passengerForm.get('countryCode')?.setValue(this.sharedService.countryCode);
        passengerForm.get('countryCode')?.markAsDirty();
      }

      if (passengerForm.get('countryName')?.value) {
        passengerForm.get('isIssuedCountrySelected')?.setValue(true);
        passengerForm.get('isIssuedCountrySelected')?.markAsDirty();
      }

      if (passengerForm.get('birthDate')) {
        const dob = passengerForm.get('birthDate')?.value;
        if (dob && dob.year) {
          passengerForm.get('dateOfBirth')?.setValue(this.formatNgbDate(dob));
        }
      }
      if (passengerForm.get('PassportExpiration')) {
        const dob = passengerForm.get('PassportExpiration')?.value;
        if (dob && dob.year) {
          passengerForm.get('PassportExpiry')?.setValue(this.formatNgbDate(dob));
        }
      }
    }
  }

  private formatNgbDate(date: { year: number; month: number; day: number }): string {
    if (!date || !date.year) return '';
    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    return `${date.year}-${month}-${day}`;
  }

  get usersArray(): FormArray {
    return this.usersForm.get('users') as FormArray;
  }

  getPassengerForm(index: number): FormGroup {
    return this.usersArray.at(index) as FormGroup;
  }

  trackByFn(index: number): number {
    return index;
  }

  getPassengerTypeLabel(type: string): string {
    let translationKey: string;
    switch (type) {
      case 'ADT':
        translationKey = 'checkout.PASSENGER_TYPES.ADULT';
        break;
      case 'CNN':
        translationKey = 'checkout.PASSENGER_TYPES.CHILD';
        break;
      case 'CHD':
        translationKey = 'checkout.PASSENGER_TYPES.CHILD';
        break;
      case 'INF':
        translationKey = 'checkout.PASSENGER_TYPES.INFANT';
        break;
      default:
        translationKey = '';
    }
    return this.translate.instant(translationKey);
  }

  countryValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { required: true };
      }

      const isValidName = this.homePageService.allCountries.some((country) => country.countryName === control.value);

      return isValidName ? null : { invalidCountry: true };
    };
  }

  isFieldInvalid(index: number, fieldName: string): boolean {
    const passengerForm = this.getPassengerForm(index);

    const checkControl = (ctrl: AbstractControl | null): boolean =>
      ctrl ? ctrl.invalid && (ctrl.dirty || ctrl.touched) : false;

    if (fieldName === 'dateOfBirth') {
      return checkControl(passengerForm.get('dateOfBirth')) || checkControl(passengerForm.get('birthDate'));
    }

    if (fieldName === 'PassportExpiry') {
      return checkControl(passengerForm.get('PassportExpiry')) || checkControl(passengerForm.get('PassportExpiration'));
    }

    if (fieldName === 'IssuedCountry') {
      return checkControl(passengerForm.get('countryName'));
    }

    return checkControl(passengerForm.get(fieldName));
  }

  getFieldError(index: number, fieldName: string): string {
    const passengerForm = this.getPassengerForm(index);
    const field = fieldName === 'IssuedCountry' ? passengerForm.get('countryName') : passengerForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    const errors = field.errors;
    let errorKey = '';
    let errorParams: any = {};

    // Map internal field names to translation keys for labels
    const fieldLabelMap: { [key: string]: string } = {
      firstName: 'checkout.travellersDetails.firstName',
      lastName: 'checkout.travellersDetails.lastName',
      middleName: 'checkout.travellersDetails.middleName',
      title: 'checkout.travellersDetails.gender',
      // Add more as needed
    };

    if (fieldLabelMap[fieldName]) {
      errorParams['fieldName'] = this.translate.instant(fieldLabelMap[fieldName]);
    } else {
       // Fallback or default formatting
       errorParams['fieldName'] = fieldName;
    }

    if (errors['required']) {
      errorKey = 'checkout.ERRORS.REQUIRED';
    } else if (errors['pattern']) {
      errorKey = 'checkout.ERRORS.PATTERN';
    } else if (errors['minlength']) {
      errorKey = 'checkout.ERRORS.MINLENGTH';
      errorParams = { ...errorParams, requiredLength: errors['minlength'].requiredLength };
    } else if (errors['lettersOnly']) {
      errorKey = 'checkout.ERRORS.LETTERS_ONLY';
    } else if (errors['leadingTrailingSpaces']) { // Updated per user request logic
      errorKey = 'checkout.ERRORS.LEADING_TRAILING_SPACES';
    } else if (errors['invalidPassport']) {
      errorKey = 'checkout.ERRORS.INVALID_PASSPORT';
    } else if (errors['email']) {
      errorKey = 'checkout.ERRORS.EMAIL';
    } else if (errors['maxlength']) {
      errorKey = 'checkout.ERRORS.MAXLENGTH';
    } else if (errors['invalidCountry']) {
      errorKey = 'checkout.ERRORS.INVALID_COUNTRY';
    } else if (errors['passportExpiryTooSoon']) {
      errorKey = 'checkout.ERRORS.PASSPORT_EXPIRY_TOO_SOON';
      errorParams = {
        requiredDate: errors['passportExpiryTooSoon'].requiredDate,
        departureDate: errors['passportExpiryTooSoon'].departureDate,
      };
    }
    if (errorKey) {
      return this.translate.instant(errorKey, errorParams);
    }
    return this.translate.instant('ERRORS.UNKNOWN_ERROR') || 'An unexpected error occurred.';
  }

  scrollToContactFormById(): void {
    const el = document.getElementById('contact-details');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  shouldHighlightPanel(index: number): boolean {
    return this.invalidPanelIndices.includes(index);
  }

  private loadContactDataToForm(): void {
    if (!this.isFormReady || !this.usersForm || this.usersArray.length === 0) {
      console.warn('Form not ready for contact data loading');
      return;
    }

    const storedData = sessionStorage.getItem('contactDetails');
    if (!storedData) {
      return;
    }

    try {
      this.contact = JSON.parse(storedData) as ContactDetails;
      const passengerForm = this.getPassengerForm(0);

      passengerForm.patchValue({
        email: this.contact?.email || '',
        phoneNumber: this.contact?.phone?.e164Number || '',
        nationality: this.contact?.country || '',
        countryCode: this.contact?.countryCode || '',
        isIssuedCountrySelected: true,
      });
    } catch (e) {
      console.error('Error parsing contact details:', e);
    }
  }

  onSubmit() {
    // Trim all form control values before submission
    this.usersArray.controls.forEach((control) => {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((key) => {
          const formControl = control.get(key);
          if (formControl && typeof formControl.value === 'string') {
            const trimmedValue = formControl.value.trim();
            if (trimmedValue !== formControl.value) {
              formControl.setValue(trimmedValue, { emitEvent: false });
              formControl.updateValueAndValidity();
            }
          }
        });
      }
    });

    this.setSharedServiceValuesToAllForms();
    this.invalidPanelIndices = [];
    const contactForm = this.sharedService.contactForm;
    if (contactForm) {
      contactForm.markAllAsTouched();
      contactForm.updateValueAndValidity();
    }
    this.sharedService.userForm = this.usersForm;
    const isContactFormValid = contactForm?.valid ?? true;

    if (this.usersForm.invalid || !isContactFormValid) {
      if (!isContactFormValid || this.usersForm.invalid) {
        this.scrollToContactFormById();
      }
      this.usersArray.controls.forEach((control, index) => {
        if (control instanceof FormGroup) {
          const hasErrors = Object.values(control.controls).some((c) => c.invalid);
          if (hasErrors) {
            this.invalidPanelIndices.push(index);
          }
          Object.values(control.controls).forEach((c) => c.markAsTouched());
        }
      });

      this.cdRef.detectChanges();

      Promise.resolve().then(() => {
        if (this.invalidPanelIndices.length > 0 && this.expansionPanels) {
          this.expansionPanels.forEach((panel, i) => {
            panel.expanded = i === this.invalidPanelIndices[0];
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
