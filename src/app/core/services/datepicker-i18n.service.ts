import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';


const I18N_VALUES: any = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  },
  ar: {
    weekdays: ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'],
    months: [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ]
  }
};
function toArabicNumerals(num: number): string {
  return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
}
@Injectable({
  providedIn: 'root'
})
export class DatepickerI18nService {
constructor(private translate: TranslateService) {}

  getWeekdayLabel(weekday: number): string {
    return I18N_VALUES[this.translate.currentLang].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this.translate.currentLang].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
  getDayAriaLabel(date: import("@ng-bootstrap/ng-bootstrap").NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
    getMonthLabel(date: NgbDateStruct): string {
    return `${I18N_VALUES[this.translate.currentLang].months[date.month - 1]} ${date.year}`;
  }
    getDayNumerals(date: NgbDateStruct): string {
    return this.translate.currentLang === 'ar' ? toArabicNumerals(date.day) : `${date.day}`;
  }

  getYearNumerals(year: number): string {
    return this.translate.currentLang === 'ar' ? toArabicNumerals(year) : `${year}`;
  }
}