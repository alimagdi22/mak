import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FlightSearchService } from 'rp-travel-ui';
import { FlightSharedService } from '../../../../core/services/flightShared.service';
import { SharedService } from '../../../shared.service';
import { MobileViewDateInputComponent } from './mobile-view-date-input/mobile-view-date-input.component';
import { interval } from 'rxjs';
import { DatepickerRtlDirective } from '../../../directives/datepickerrtl.directive';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MobileViewDateInputComponent,
    TranslatePipe,
    MatMenuModule,
    NgbDatepickerModule,
    DatepickerRtlDirective
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss',
})
export class DateInputComponent implements OnInit, OnChanges {
  @Input({ required: true }) flightItem: AbstractControl = new FormControl();
  @Input({ required: true }) index = -1;
  @Input({ required: true }) isReturnDate = false;
  @Input() isAddReturnSelected = false;
  @Input() openCalendar = 0;

  public translate = inject(TranslateService);
  public sharedService = inject(SharedService);
  public renderer = inject(Renderer2);
  public flightSharedService = inject(FlightSharedService);
  public flightSearchService = inject(FlightSearchService);

  private modalService = inject(NgbModal);

  openRoundTripCalendar = output<void>();
  restInput = output<void>();

  @ViewChild('calenderTrigger') calenderTrigger!: ElementRef;

  calendar = inject(NgbCalendar);
  departDate: any = null;
  minDate: any;
  startDateValue: any;
  endDateValue: Date = new Date(2023, 9, 30);
  hoveredDate: NgbDate | null = null;
  calendarMinDate: any;
  calendarStartDate: any;
  onClickInput(template: TemplateRef<any>) {
    if (this.sharedService.screenWidth < this.sharedService.webViewBreakPoint) {
      this.modalService.open(template, { fullscreen: true });
    }
  }

  isCalanderNotValid(index: number) {
    if (this.flightSearchService.searchFlight.get('flightType')?.value === 'RoundTrip') {
      return (
        (this.flightSearchService.flightsArray.at(index).get('departingD')?.invalid &&
          this.flightSearchService.flightsArray.at(index).get('departingD')?.touched) ||
        (!this.flightSearchService.searchFlight.get('returnDate')?.value &&
          this.flightSearchService.searchFlight.get('returnDate')?.touched)
      );
    }

    return (
      this.flightSearchService.flightsArray.at(index).get('departingD')?.invalid &&
      this.flightSearchService.flightsArray.at(index).get('departingD')?.touched
    );
  }

  ngOnInit(): void {
     const today = this.calendar.getToday();

  // Set displayed start date
  const departingValue = this.flightSearchService.flightsArray.at(this.index).get('departingD')?.value;
  this.departDate = this.generateCalendarDate(departingValue);

  // Calendar start should show the selected date if available
  this.calendarStartDate = this.departDate ? this.departDate : today;

  // But minDate should remain as today (no restriction from depart date)
  this.calendarMinDate = today;
  }

  ngOnChanges(simpleChange: SimpleChanges): void {
    setTimeout(() => {
      if (this.isAddReturnSelected) {
        this.calenderTrigger?.nativeElement?.click();
        this.isAddReturnSelected = false;
        this.restInput.emit();
      }
    }, 100);

    if (this.openCalendar && this.isReturnDate && !simpleChange['openCalendar'].firstChange) {
      this.calenderTrigger?.nativeElement?.click();
    }

    this.departDate = this.generateCalendarDate(
      this.flightSearchService.flightsArray.at(this.index).get('departingD')?.value,
    );
     const departingValue = this.flightSearchService.flightsArray.at(this.index).get('departingD')?.value;
  this.departDate = this.generateCalendarDate(departingValue);
  const today = this.calendar.getToday();

  this.calendarStartDate = this.departDate ? this.departDate : today;
  }

  closeCalendar(e: Event) {
    e.stopPropagation();
    this.calenderTrigger.nativeElement?.click();
  }

  onDateSelection(date: NgbDate, index: number) {
    if (this.isReturnDate) {
      this.flightSearchService.searchFlight.get('returnDate')?.setValue(new Date(date.year, date.month - 1, date.day));
      return;
    }

    this.flightSearchService.flightsArray
      .at(index)
      .get('departingD')
      ?.setValue(new Date(date.year, date.month - 1, date.day));

    this.departDate = this.generateCalendarDate(
      this.flightSearchService.flightsArray.at(index).get('departingD')?.value,
    );

    this.hoveredDate = null;

    if (this.flightSharedService.selectedFlightType === 'roundtrip') {
      this.flightSearchService.searchFlight.get('returnDate')?.setValue(null);
      this.openRoundTripCalendar.emit();
    }

    if (this.flightSharedService.selectedFlightType === 'multicity') this.multiCityDateChecker(index);
  }

  generateCalendarDate(dateArg: any) {
    if (!dateArg) {
      return null;
    }

    let parsed: { year: number; month: number; day: number } | null = null;

    if (dateArg instanceof Date) {
      parsed = {
        year: dateArg.getFullYear(),
        month: dateArg.getMonth() + 1,
        day: dateArg.getDate()
      };
    } else if (typeof dateArg === 'string') {
      if (dateArg.includes('T') || /\s\d{2}:\d{2}/.test(dateArg)) {
        const d = new Date(dateArg);
        if (!isNaN(d.getTime())) {
          parsed = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
          };
        }
      } else {
        const parts = dateArg.split(/[-/]/);
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const day = parseInt(parts[2], 10);
          if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            parsed = { year, month, day };
          }
        }
      }

      if (!parsed) {
        const d = new Date(dateArg);
        if (!isNaN(d.getTime())) {
          parsed = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
          };
        }
      }
    } else {
      const d = new Date(dateArg);
      if (!isNaN(d.getTime())) {
        parsed = {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          day: d.getDate()
        };
      }
    }

    return parsed;
  }

  multiCityDateChecker(curIndex: number) {
    let isDateInvalide = false;

    for (let i = 0; i < this.flightSearchService.flightsArray.length; i++) {
      if (isDateInvalide) {
        this.flightSearchService.flightsArray.at(i).get('departingD')?.setValue('');
        this.flightSearchService.flightsArray.at(i).get('departingD')?.markAsTouched();
        continue;
      }

      let preDate: string | Date = '';
      let curDate: string | Date = this.flightSearchService.flightsArray.at(i).get('departingD')?.value;
      let nxtDate: string | Date = '';

      if (i) {
        preDate = this.flightSearchService.flightsArray.at(i - 1).get('departingD')?.value;
      } else {
        preDate = 'value';
      }

      if (i !== this.flightSearchService.flightsArray.length - 1) {
        nxtDate = this.flightSearchService.flightsArray.at(i + 1).get('departingD')?.value;
      } else {
        nxtDate = 'value';
      }

      if (!preDate && i <= curIndex) {
        i--;
        isDateInvalide = true;
        continue;
      }

      curDate = new Date(curDate);
      nxtDate = new Date(nxtDate);

      if (curDate >= nxtDate) {
        isDateInvalide = true;
      }
    }
  }

  isDepartSelected(date: NgbDate, index: number) {
    const departingDate = this.generateCalendarDate(
      this.flightSearchService.flightsArray.at(index).get('departingD')?.value,
    );

    if (!departingDate) {
      return false;
    }

    return (
      date.year + '-' + date.month + '-' + date.day ===
      `${departingDate.year}-${departingDate.month}-${departingDate.day}`
    );
  }

  isDisabled(date: NgbDate) {
    date.before(this.minDate);
  }

  isHovered(date: NgbDate) {
    return this.startDateValue && date.after(this.startDateValue) && date.before(this.startDateValue);
  }

  isRange(date: NgbDate) {
    const departingDate = this.generateCalendarDate(
      this.flightSearchService.flightsArray.at(this.index).get('departingD')?.value,
    );

    if (!departingDate) {
      return false;
    }

    const returnValue = this.flightSearchService.searchFlight.get('returnDate')?.value;
    const returnDate = returnValue ? this.generateCalendarDate(returnValue) : null;

    // Convert to NgbDate objects for easier comparison
    const depart = new NgbDate(departingDate.year, departingDate.month, departingDate.day);
    const hover = this.hoveredDate;
    const ret = returnDate ? new NgbDate(returnDate.year, returnDate.month, returnDate.day) : null;

    // Highlight when hovering OR after selecting both dates
    return (
      (hover && date.after(depart) && date.before(hover)) ||
      (ret && date.after(depart) && date.before(ret))
    );
  }

  isReturnSelected(date: NgbDate) {
    const returnDate = this.generateCalendarDate(this.flightSearchService.searchFlight.get('returnDate')?.value);

    if (!returnDate) {
      return false;
    }

    return date.year + '-' + date.month + '-' + date.day === `${returnDate.year}-${returnDate.month}-${returnDate.day}`;
  }
}
