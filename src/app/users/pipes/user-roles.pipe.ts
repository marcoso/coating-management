import { Pipe, PipeTransform } from '@angular/core';
import { UserRoles } from 'src/app/core/enums/user-roles';

@Pipe({
  name: 'userRoles'
})
export class UserRolesPipe implements PipeTransform {

    transform(value: UserRoles): string {             
        if(!isNaN(Number(value))) {
            value = Number(value);
        }
        let type = '';
        switch (value) {
            case UserRoles.Administrator:
              type = 'Administrator';
              break;		  		  
            case UserRoles.ProjectManager:
              type = 'Project Manager';
              break;            
            case UserRoles.Inspection:
              type = 'Inspector';
              break;            
          }
        return type;
    }
}
