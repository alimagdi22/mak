import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floorDecimal',
})
export class FloorDecimalPipe implements PipeTransform {
  transform(value: number, decimalPlaces: number = 2): string {
    if (value == null) return '';

    // Check if the number is an integer
    if (Number.isInteger(value)) {
      return value.toString();
    }

    // Floor the number to the desired decimal places
    const factor = Math.pow(10, decimalPlaces);
    const flooredValue = Math.floor(value * factor) / factor;

    return flooredValue.toFixed(decimalPlaces).replace(/\.?0+$/, '');
  }
}
