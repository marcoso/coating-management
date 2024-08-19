import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SubArea } from '../clients/models/sub-area.model';
import { MeasurementUnits } from '../core/enums/measurement-units';
import { ProjectStatus } from '../core/enums/project-status';
import { ApiService } from '../services/api.service';
import { UnsubscribeOnDestroyAdapter } from '../shared/UnsubscribeOnDestroyAdapter';
import { MeasurementConfiguration } from './models/measurement-configuration.model';
import { MeasurementHistorical } from './models/measurement-historical.model';
import { ProjectAreaFile } from './models/project-area-file.model';
import { ProjectAreaMeasurementStatus } from './models/project-area-measurement-status.model';
import { ProjectAreaMeasurement } from './models/project-area-measurement.model';
import { ProjectReport } from './models/project-report.model';
import { ReportFile } from './models/report-file.model';
import { Project } from './project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends UnsubscribeOnDestroyAdapter {
    projectsDataSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
    myProjectsDataSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
    projectReportsDataSubject: BehaviorSubject<ProjectReport[]> = new BehaviorSubject<ProjectReport[]>([]);
    isProjectsDataLoading = true;
    isMyProjectsDataLoading = true;
    isProjectReportsDataLoading = true;

	constructor(private apiService : ApiService) {
        super();
    }

    get projectsData(): Project[] {
        return this.projectsDataSubject.value;
    }

    get myProjectsData(): Project[] {
        return this.myProjectsDataSubject.value;
    }

    get projectReportsData(): ProjectReport[] {
        return this.projectReportsDataSubject.value;
    }

    get(projectId: string) : Observable<Project> {
        return this.apiService.get<Project>('projects/' + projectId);        
    }

  	getAll() : void {
        this.subs.sink = this.apiService.get<Project[]>('projects/all')
        .subscribe(
          (data) => {
            this.isProjectsDataLoading = false;
            this.projectsDataSubject.next(data);
          },
          (error: HttpErrorResponse) => {
            this.isProjectsDataLoading = false;
            console.log(error.name + ' ' + error.message);
          }
        );
	}

    getMyProjects() : void {
        this.subs.sink = this.apiService.get<Project[]>('projects')
        .subscribe(
          (data) => {
            this.isMyProjectsDataLoading = false;
            this.myProjectsDataSubject.next(data);
          },
          (error: HttpErrorResponse) => {
            this.isMyProjectsDataLoading = false;
            console.log(error.name + ' ' + error.message);
          }
        );
	}

    getMyProjectsList(): Observable<Project[]> {
        return this.apiService.get<Project[]>('projects');
    }

    add(project: Project) : Observable<Project> {
        return this.apiService.post<Project>(`projects`, project);        
    }

    update(project: Project) : Observable<Project> {
        return this.apiService.put<Project>(`projects`, project);        
    }

    addMeasurement(measurement: ProjectAreaMeasurement): Observable<ProjectAreaMeasurement>{
        return this.apiService.post<ProjectAreaMeasurement>(`projects/measurement`, measurement);
    }

    getMeasurements(projectAreaId: string): Observable<ProjectAreaMeasurement[]> {
        return this.apiService.get<ProjectAreaMeasurement[]>(`projects/measurement/${projectAreaId}`);
    }

    getMeasurementsHistorical(projectAreaMeasurementId: string, projectEquipmentId: string, projectAreaId: string, elevation: number, tubeNumber: number, projectStartDate: string): Observable<MeasurementHistorical[]> {
        return this.apiService.get<MeasurementHistorical[]>(`projects/measurement/historical/${projectAreaMeasurementId}/${projectEquipmentId}/${projectAreaId}/${elevation}/${tubeNumber}/${projectStartDate}`);
    }

    getMeasurementsMaxUpdatedDate(projectId: string): Observable<string> {
        return this.apiService.get<string>(`projects/measurement/lastchange/${projectId}`);
    }

    getSubareasConfiguration(projectEquipmentId: string): Observable<SubArea[]> {
        return this.apiService.get<SubArea[]>(`projects/measurement/configuration/${projectEquipmentId}`);        
    }

    enableDots(projectAreaMeasurements: ProjectAreaMeasurement[]) : Observable<ProjectAreaMeasurementStatus[]>{
        const projectAreaMeasurementStatuses: ProjectAreaMeasurementStatus[] = projectAreaMeasurements.map( measurement => {
            return new ProjectAreaMeasurementStatus(measurement.projectAreaMeasurementId, measurement.projectAreaId, measurement.value, measurement.status)
        });

        return this.apiService.put<ProjectAreaMeasurementStatus[]>(`projects/measurement`, projectAreaMeasurementStatuses);
    }

    importMeasurementsConfiguration(measurementConfiguration: MeasurementConfiguration, selectedProjectAreaId: string) : Observable<any> {   
        const formData = new FormData();
        const subAreasData = JSON.stringify(measurementConfiguration.subAreas);
        let projectAreaFilenameModel : ProjectAreaFile[] = [];
        let projectAreaOriginalFilenameModel : ProjectAreaFile[] = [];        
        formData.append('subAreasData', subAreasData);
        formData.append('projectEquipmentId', measurementConfiguration.projectEquipmentId);
        formData.append('selectedProjectAreaId', selectedProjectAreaId ? selectedProjectAreaId : '');
        
        if (measurementConfiguration.projectAreaFileSet) {
            measurementConfiguration.projectAreaFileSet.forEach((file, projectAreaId) => {
                formData.append('files', file, file.name);
                const model = new ProjectAreaFile();
                model.projectAreaId = projectAreaId;
                model.filename = file.name;
                projectAreaFilenameModel.push(model);
            });
            formData.append('projectAreaFilenameList', JSON.stringify(projectAreaFilenameModel));
        }

        if(measurementConfiguration.projectAreaOriginalFileNameSet){
            measurementConfiguration.projectAreaOriginalFileNameSet.forEach((originalFilename , projectAreaId)=> {
                const model = new ProjectAreaFile();
                model.projectAreaId = projectAreaId;
                model.filename = originalFilename;
                projectAreaOriginalFilenameModel.push(model);
            });
            formData.append('projectAreaOriginalFilenameList', JSON.stringify(projectAreaOriginalFilenameModel));
        }

        return this.apiService.postFile<any>('projects/measurement/import', formData);
    }

    importReport(reportFileModel: ReportFile): Observable<any>{
        const formData = new FormData();      
        formData.append('projectId', reportFileModel.projectId);
        formData.append('file', reportFileModel.file, reportFileModel.file.name);
        return this.apiService.postFile<any>('projects/report/import', formData);
    }

    generateEquipmentReport(projectId: string, projectEquipmentId: string) : Observable<string> {
        return this.apiService.getFile(`projects/measurement/seereport/${projectId}/${projectEquipmentId}`);
    }

    getCompletedReports(): void{
        this.subs.sink = this.apiService.get<ProjectReport[]>(`projects/reports`)
        .subscribe(
          (data) => {
            this.isProjectReportsDataLoading = false;
            this.projectReportsDataSubject.next(data);
          },
          (error: HttpErrorResponse) => {
            this.isProjectReportsDataLoading = false;
            console.log(error.name + ' ' + error.message);
          }
        );
    }
    
    getReportBase64(projectReportId: string): Observable<string>{
        return this.apiService.getFile(`projects/report/${projectReportId}`);
    }
}
