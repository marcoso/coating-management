import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { CompletedReportsComponent } from './completed-reports/completed-reports.component';

const routes: Routes = [
	{ path: '',	component: MyProjectsComponent},
  { path: 'my-projects', component: MyProjectsComponent},
	{ path: 'all',	component: ProjectsComponent},
  { path: 'project', component: NewProjectComponent},
  { path: 'project/:id', component: NewProjectComponent},
  { path: 'project-detail/:id', component: ProjectDetailsComponent},
  { path: 'completed-reports',	component: CompletedReportsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
