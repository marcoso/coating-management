import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import Swal from 'sweetalert2';
import { UnsubscribeOnDestroyAdapter } from '../shared/UnsubscribeOnDestroyAdapter';
import { UserDataSource } from './model-sources/user-data-source';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    displayedColumns: string[] = ['firstName', 'lastName', 'username', 'role', 'isActive', 'detail'];
    dataSource : UserDataSource | null;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;    

    constructor(
        public userService: UserService, 
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar) { 
      super();    
    }
  
    ngOnInit(): void {
        this.loadData();
    }
  
    public loadData() {
      this.dataSource = new UserDataSource(
        this.userService,
        this.paginator,
        this.sort
      );
      this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup')
        .subscribe(() => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
    }

    newUser() {
        this.router.navigate(['/users/user']);
    }

    deleteUser(userId : string) {                
        if(userId) {                  
            Swal.fire({                
                text: "Are you sure you want to remove the user?",                
                showCancelButton: true,
                confirmButtonColor: '#EF473A',
                cancelButtonColor: '#0198F1',
                confirmButtonText: 'Remove'
              }).then((result) => {
                if (result.isConfirmed) {                    
                    this.userService.delete(userId)			
                    .subscribe(
                        (user) => {                                        
                            const users = this.userService.usersData;
                            const usersFiltered = users.filter(user => user.userId !== userId);
                            this.userService.usersDataSubject.next(usersFiltered);  
                            
                            this.showNotification(
                                'snackbar-success',
                                'User successfully removed',
                                'bottom',
                                'center'
                            );
                        },
                        (error: HttpErrorResponse) => { this.showErrorNotification(); }
                    );                  
                }
            });                                    
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
  
