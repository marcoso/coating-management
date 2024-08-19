import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserRoles } from 'src/app/core/enums/user-roles';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
    model = new User();
    userId : string;
    roles = UserRoles;
    roleKeys = [];
    hide = true;

    constructor(        
        private userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private snackBar: MatSnackBar) { 
            this.roleKeys = Object.keys(this.roles).filter(role => !isNaN(Number(role))).map(Number);
            this.model.isActive = true;
    }

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((parameters : ParamMap)=> {
            if(parameters.has('id')) {                   
                this.userId = parameters.get('id');
                this.userService.get(this.userId)			
                .subscribe(
                    (user) => {
                        this.model = user;            
                    },
                    (error: HttpErrorResponse) => { this.showErrorNotification(); }
                );            
            }        
          });
    }

    onSubmit() { 
        if (this.userId) {          
          this.userService.update(this.model)			
          .subscribe(
            (data) => {            
                this.showNotification(
                    'snackbar-success',
                    'User successfully updated',
                    'bottom',
                    'center'
                );
                this.router.navigate(['users']);
            },
            (error: HttpErrorResponse) => { this.showErrorNotification(); }
          );
        } else {          
          this.userService.add(this.model)			
          .subscribe(
            (data) => {
                this.showNotification(
                    'snackbar-success',
                    'User successfully added',
                    'bottom',
                    'center'
                );
                this.router.navigate(['users']);
            },
            (error: HttpErrorResponse) => { this.showErrorNotification(); }
          );
        }      
    }

    showNotification(colorName, text, placementFrom, placementAlign) {
        this.snackBar.open(text, '', {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName
        });
    }
    
    showErrorNotification() {
        this.showNotification(
            'snackbar-danger',
            'An error occurred, please try again.',
            'bottom',
            'center'
        );
    }
}
