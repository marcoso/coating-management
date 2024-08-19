import { Pipe, PipeTransform } from '@angular/core';
import { ElevationUnits } from 'src/app/core/enums/elevation-units';

@Pipe({
  name: 'elevationUnits'
})
export class ElevationUnitsPipe implements PipeTransform {

    transform(value: ElevationUnits): string {      
        let units = '';
        switch (value) {
            case ElevationUnits.Feets:
              units = 'Feet';
              break;		  		  
            case ElevationUnits.Centimeters:
              units = 'Centimeter';
              break;            
          }
        return units;
    }

}
