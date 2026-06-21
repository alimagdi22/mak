import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number, preStr: string): string {
    if (!value) return '';
    if (value.length + preStr.length <= limit) {
      return value;
    }
    return value.slice(0, limit - (preStr.length + value.length)) + '...'; // 3 for the dots
  }
}
