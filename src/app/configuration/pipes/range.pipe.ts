import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {

  transform(value: string, min: number, max: number): string {      
    return max > 0 ? (min.toString() + ' - ' + max.toString()) : min.toString() + '+';
  }

}
