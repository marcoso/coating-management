import { Pipe, PipeTransform } from '@angular/core';
import { MeasurementUnits } from 'src/app/core/enums/measurement-units';

@Pipe({
  name: 'measurementUnit'
})
export class MeasurementUnitPipe implements PipeTransform {

    transform(value: MeasurementUnits): string {      
        let unit = '';
        switch (value) {
            case MeasurementUnits.Mils:
                unit = 'Mils';
              break;		  		  
            case MeasurementUnits.Microns:
                unit = 'Microns';
              break;            
          }
        return unit;
    }

}
