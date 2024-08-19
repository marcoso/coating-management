import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { User } from 'src/app/users/models/user.model';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent extends UnsubscribeOnDestroyAdapter implements OnInit {    
    action : string;        
    teamMembersForm: FormGroup;  
    dialogTitle: string;
    users : User[] = [];
    selected: any;        
    usersSet = new Map();
    usersOriginalSet = new Map();
    filteredOptions: any[] = [];

    constructor(
    public dialogRef: MatDialogRef<TeamMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) {
        super();
        // Set the defaults
        this.action = data.action;                   
        this.usersSet = new Map(data.usersSet);
        this.usersOriginalSet = new Map(data.usersSet);
        this.subs.sink = data.users.subscribe(
            users => {
                this.filteredOptions = [...users];
                this.users = users;                
            }
        );

        if (this.action === 'add') {            
            this.dialogTitle = 'Add';                    
        } else if (this.action === 'edit') {            
            this.dialogTitle = 'Edit';  
        }
    }

    ngOnInit(): void {
    } 

    onSearch(searchTerm: string) {
        this.filteredOptions = this.users.filter(user =>
          (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm)
        );
    }

    selectionChange($event: any) {
        this.usersSet.set(
            $event.option.value,
            !this.usersSet.get($event.option.value)
        );
    }
    
    cancelClick() : void {
        this.usersSet = new Map(this.usersOriginalSet);
        this.dialogRef.close();
    }

    onSubmit() {
    // List of selected Team Members is passed as a result in the mat-dialog-close attribute so the opener can receive the data
    }    

}