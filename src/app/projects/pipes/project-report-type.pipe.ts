import { Pipe, PipeTransform } from '@angular/core';
import { ProjectReportType } from 'src/app/core/enums/project-report-type';

@Pipe({
  name: 'projectReportType'
})
export class ProjectReportTypePipe implements PipeTransform {

  transform(value: ProjectReportType): string {      
    let type = '';
    switch (value) {
        case ProjectReportType.Automatic:
            type = 'Automatic';
          break;		  		  
        case ProjectReportType.Manual:
            type = 'Manual';
          break;            
      }
    return type;
}

}
