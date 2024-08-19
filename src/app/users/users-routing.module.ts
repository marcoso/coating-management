import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewUserComponent } from './new-user/new-user.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
    { path: '', component: UsersComponent},  
    { path: 'users', component: UsersComponent},
    { path: 'user',	component: NewUserComponent},
    { path: 'user/:id',	component: NewUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
