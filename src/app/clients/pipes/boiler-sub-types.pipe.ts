import { Pipe, PipeTransform } from '@angular/core';
import { BoilerSubTypes } from 'src/app/core/enums/boiler-sub-types';

@Pipe({
  name: 'boilerSubTypes'
})
export class BoilerSubTypesPipe implements PipeTransform {

    transform(value: BoilerSubTypes): string {             
        if(!isNaN(Number(value))) {
            value = Number(value);
        }
        let type = '';
        switch (value) {
            case BoilerSubTypes.Cfb:
              type = 'CFB';
              break;		  		  
            case BoilerSubTypes.CoalFired:
              type = 'Coal-Fired';
              break;            
            case BoilerSubTypes.Wte:
              type = 'WTE';
              break;
            case BoilerSubTypes.Other:
              type = 'Other';
              break;            
          }
        return type;
    }

}
