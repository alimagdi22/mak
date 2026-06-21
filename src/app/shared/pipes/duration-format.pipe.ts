import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'durationFormat',
  standalone: true,
})
export class DurationFormatPipe implements PipeTransform {
  translate = inject(TranslateService);
  transform(minutes: number): string {
    if (isNaN(minutes) || minutes < 0) return 'Invalid time';

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    let hourText = '';
    let minText = '';

    if(this.translate.currentLang === 'ar'){
      hourText = 'ساعة';
      minText = 'دقيقة';
    }else{
      hourText = 'h';
      minText = 'm';
    }

    if (hrs && mins) return `${hrs} ${hourText}  ${mins} ${minText}`;
    if (hrs) return `${hrs} ${hourText}`;
    return `${mins} ${minText}`;
  }
}
