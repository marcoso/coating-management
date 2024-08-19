import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorDescriptionTemplatesComponent } from './color-description-templates/color-description-templates.component';

const routes: Routes = [
	{ path: '', component: ColorDescriptionTemplatesComponent},  
    { path: 'color-templates', component: ColorDescriptionTemplatesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
