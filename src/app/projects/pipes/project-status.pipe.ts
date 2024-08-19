import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus } from 'src/app/core/enums/project-status';

@Pipe({
  name: 'projectStatus'
})
export class ProjectStatusPipe implements PipeTransform {

    transform(value: ProjectStatus): string {      
        let status = '';
        switch (value) {
            case ProjectStatus.Pending:
              status = 'Pending';
              break;		  		  
            case ProjectStatus.OnGoing:
              status = 'Ongoing';
              break;
            case ProjectStatus.Completed:
              status = 'Completed';
              break;
            case ProjectStatus.Cancelled:
              status = 'Cancelled';
              break;        
          }
        return status;
    }

}
