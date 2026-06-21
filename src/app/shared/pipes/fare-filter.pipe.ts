import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fareFilter' })
export class FareFilterPipe implements PipeTransform {
  transform(fares: any[], fareType: string) {
    return fares.find((fare) => fare.fareType === fareType);
  }
}
