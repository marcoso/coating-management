import { Pipe, PipeTransform } from '@angular/core';
import { EquipmentTypes } from 'src/app/core/enums/equipment-types';

@Pipe({
  name: 'equipmentTypes'
})
export class EquipmentTypesPipe implements PipeTransform {

    transform(value: EquipmentTypes): string {             
        if(!isNaN(Number(value))) {
            value = Number(value);
        }
        let type = '';
        switch (value) {
            case EquipmentTypes.Boiler:
              type = 'Boiler';
              break;		  		  
            case EquipmentTypes.Vessel:
              type = 'Vessel';
              break;            
          }
        return type;
    }

}
