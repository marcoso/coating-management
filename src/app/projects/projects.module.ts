import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ProjectsRoutingModule } from './projects-routing.module';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectsService } from './projects.service';
import { ProjectStatusPipe } from './pipes/project-status.pipe';
import { MeasurementUnitPipe } from './pipes/measurement-unit.pipe';
import { NewProjectComponent } from './new-project/new-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { TeamMembersComponent } from './dialog-forms/team-members/team-members.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchComponent } from './search/search.component';
import { MatListModule } from '@angular/material/list';
import { UsersModule } from '../users/users.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientsModule } from '../clients/clients.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { DotEditorComponent } from './dialog-forms/dot-editor/dot-editor.component';
import { SubAreaComponent } from './dialog-forms/sub-area/sub-area.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReportTypePipe } from './pipes/report-type.pipe';
import { DateSelectorDirective } from './directives/date-selector.directive';
import { CompletedReportsComponent } from './completed-reports/completed-reports.component';
import { AddReportComponent } from './dialog-forms/add-report/add-report.component';
import { ProjectReportTypePipe } from './pipes/project-report-type.pipe';
import { NgxSelectoComponent, NgxSelectoModule } from "ngx-selecto";


@NgModule({
  declarations: [
    MyProjectsComponent,
    ProjectsComponent,
    ProjectStatusPipe,
    MeasurementUnitPipe,
    ReportTypePipe,
    NewProjectComponent,
    TeamMembersComponent,
    SearchComponent,
    ProjectDetailsComponent,
    DotEditorComponent,
    SubAreaComponent,
    DateSelectorDirective,
    CompletedReportsComponent,
    AddReportComponent,
    ProjectReportTypePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProjectsRoutingModule,
	MatTableModule,
	MatSortModule,
	MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatDatepickerModule,
    MatStepperModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatListModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    UsersModule,
    ClientsModule,
    ConfigurationModule,
    NgxSelectoModule,
  ],
  providers: [
	  ProjectsService,
    ProjectReportTypePipe
  ],
  exports: [
    ProjectStatusPipe,
    MeasurementUnitPipe,
    ReportTypePipe,
    DateSelectorDirective,
    ProjectReportTypePipe
  ]
})
export class ProjectsModule { }
