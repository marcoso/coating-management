import { Pipe, PipeTransform } from '@angular/core';
import { VesselSubTypes } from 'src/app/core/enums/vessel-sub-types';

@Pipe({
  name: 'vesselSubTypes'
})
export class VesselSubTypesPipe implements PipeTransform {

    transform(value: VesselSubTypes): string {             
        if(!isNaN(Number(value))) {
            value = Number(value);
        }
        let type = '';
        switch (value) {
            case VesselSubTypes.AmineColumn:
              type = 'Amine Column';
              break;		  		  
            case VesselSubTypes.CoolingTank:
              type = 'Cooling Tank';
              break;            
            case VesselSubTypes.Fractionator:
              type = 'Fractionator';
              break;            
            case VesselSubTypes.KoDrum:
              type = 'KO Drum';
              break;		  		  
            case VesselSubTypes.QuenchColumn:
              type = 'Quench Column';
              break;            
            case VesselSubTypes.Tank:
              type = 'Tank';
              break;
            case VesselSubTypes.Other:
              type = 'Other';
              break;            
          }
        return type;
    }

}
