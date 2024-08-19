import { Pipe, PipeTransform } from '@angular/core';
import { ReportTypes } from 'src/app/core/enums/report-types';

@Pipe({
  name: 'reportTypePipe'
})
export class ReportTypePipe implements PipeTransform {

    transform(value: ReportTypes): string {      
        let type = '';
        switch (value) {
            case ReportTypes.InitialCoatingInspection:
                type = 'Initial Coating Inspection';
              break;		  		  
            case ReportTypes.FinalCoatingInspection:
                type = 'Final Coating Inspection';
              break;            
          }
        return type;
    }

}
