import { Component, inject, Input, output } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FlightSearchService } from 'rp-travel-ui';
import { TFlightType } from '../../../../../core/models/flightType.model';
import { InputHeaderComponent } from '../../input-header/input-header.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-mobile-view-date-input',
  standalone: true,
  imports: [NgbDatepickerModule, InputHeaderComponent, TranslatePipe],
  templateUrl: './mobile-view-date-input.component.html',
  styleUrl: './mobile-view-date-input.component.scss',
})
export class MobileViewDateInputComponent {
  @Input({ required: true }) index = -1;
  @Input({ required: true }) flightType: TFlightType = 'roundtrip';
  @Input({ required: true }) isReturnDate = false;

  closemodel = output<void>();

  public calendar = inject(NgbCalendar);
  public flightSearchService = inject(FlightSearchService);

  departingDate: NgbDate = new NgbDate(1999, 1, 9);
  returnDate: NgbDate = new NgbDate(1999, 1, 9);

  minDepartingDate: NgbDate = new NgbDate(1999, 1, 9);

  ngOnInit(): void {
    const departingDate = this.flightSearchService.flightsArray?.at(this.index).get('departingD')?.value;
    const returnDate = this.flightSearchService.searchFlight.get('returnDate')?.value;

    this.departingDate = this.parseNgBootstrapDate(this.departingDate, departingDate, false);
    this.returnDate = this.parseNgBootstrapDate(this.returnDate, returnDate, false);

    this.minDepartingDate = this.calendar.getToday();
  }

  parseNgBootstrapDate(ngbDate: NgbDate, date: any, addDay: boolean) {
    if (!date) {
      return this.calendar.getToday();
    }

    let parsed: { year: number; month: number; day: number } | null = null;

    if (date instanceof Date) {
      parsed = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
    } else if (typeof date === 'string') {
      if (date.includes('T') || /\s\d{2}:\d{2}/.test(date)) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
          parsed = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
          };
        }
      } else {
        const parts = date.split(/[-/]/);
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
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
          parsed = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
          };
        }
      }
    } else {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        parsed = {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          day: d.getDate()
        };
      }
    }

    if (!parsed) {
      return this.calendar.getToday();
    }

    ngbDate.year = parsed.year;
    ngbDate.month = parsed.month;
    if (addDay) {
      ngbDate.day = parsed.day + 1;
    } else {
      ngbDate.day = parsed.day;
    }

    return ngbDate;
  }

  onDateSelection(date: NgbDate) {
    if (this.isReturnDate) {
      this.flightSearchService.searchFlight
        .get('returnDate')
        ?.setValue(`${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`);
    } else {
      this.flightSearchService.flightsArray
        .at(this.index)
        ?.get('departingD')
        ?.setValue(`${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`);
    }

    if (!this.isReturnDate) {
      this.flightSearchService.searchFlight.get('returnDate')?.setValue('');
    }

    localStorage.setItem('form', JSON.stringify(this.flightSearchService.searchFlight.value));

    this.backToSearchBox();
  }

  backToSearchBox() {
    this.closemodel.emit();
  }

  isSelected(date: NgbDate) {
    return (
      (this.departingDate.equals(date) &&
        this.flightSearchService.flightsArray?.at(this.index).get('departingD')?.value) ||
      (this.returnDate.equals(date) &&
        this.flightType === 'roundtrip' &&
        this.flightSearchService.searchFlight.get('returnDate')?.value)
    );
  }

  isInside(date: NgbDate) {
    return date.after(this.departingDate) && date.before(this.returnDate);
  }
}
