import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateRange',
})
export class CustomDateRangePipe implements PipeTransform {
  transform(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate();
    const monthShort = date.toLocaleString('en-US', { month: 'short' });

    return `${day} ${monthShort}`;
  }
}
