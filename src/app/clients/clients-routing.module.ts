import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientsComponent } from './clients.component';
import { NewClientComponent } from './new-client/new-client.component';

const routes: Routes = [
	{ path: '', component: ClientsComponent},  
    { path: 'clients', component: ClientsComponent},  
    { path: 'client',	component: NewClientComponent},
    { path: 'client/:id',	component: NewClientComponent},
    { path: 'client-detail/:id',	component: ClientDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
