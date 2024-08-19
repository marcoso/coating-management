import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserRolesPipe } from './pipes/user-roles.pipe';
import { UserService } from './services/user.service';
import { NewUserComponent } from './new-user/new-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    UsersComponent,
    UserRolesPipe,
    NewUserComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
	MatSortModule,
	MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule
  ],
  exports: [
      UserRolesPipe
  ],
  providers: [
      UserService
  ]
})
export class UsersModule { }
