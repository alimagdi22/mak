import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'timeFormatTransit',
  standalone: true,
})
export class TimeFormatTransitPipe implements PipeTransform {
  translate = inject(TranslateService);
  transform(value: string): string {
    if (!value) return '';

    const [hoursStr, minutesStr] = value.split(':');
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    let hourText = '';
    let minText = '';

    if(this.translate.currentLang === 'ar'){
      hourText = 'ساعة';
      minText = 'دقيقة';
    }else{
      hourText = 'h';
      minText = 'm';
    }

    if(hours && minutes) {
      return `${hours} ${hourText}  ${minutes} ${minText}`;
    } else if(hours) {
      return `${hours} ${hourText}`;
    } else {
      return `${minutes} ${minText}`;
    }
  }
}
