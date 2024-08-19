import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, shareReplay } from 'rxjs';
import { AreaComponent } from 'src/app/clients/dialog-forms/area/area.component';
import { EquipmentComponent } from 'src/app/clients/dialog-forms/equipment/equipment.component';
import { SubArea } from 'src/app/clients/models/sub-area.model';
import { AreaService } from 'src/app/clients/services/area.service';
import { EquipmentService } from 'src/app/clients/services/equipment.service';
import { EquipmentTypes } from 'src/app/core/enums/equipment-types';
import { ProjectStatus } from 'src/app/core/enums/project-status';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DotEditorComponent } from '../dialog-forms/dot-editor/dot-editor.component';
import { SubAreaComponent } from '../dialog-forms/sub-area/sub-area.component';
import { EquipmentColorTemplate } from '../models/equipment-color-template.model';
import { ImportResult } from '../models/import-result.model';
import { MeasurementConfiguration } from '../models/measurement-configuration.model';
import { ProjectAreaBatchNotFound } from '../models/project-area-batch-not-found.model';
import { ProjectAreaMeasurementStatus } from '../models/project-area-measurement-status.model';
import { ProjectAreaMeasurement } from '../models/project-area-measurement.model';
import { ProjectArea } from '../models/project-area.model';
import { ProjectColorTemplateParam } from '../models/project-color-template-param.model';
import { ProjectColorTemplate } from '../models/project-color-template.model';
import { ProjectEquipmentColorTemplate } from '../models/project-equipment-color-template.model';
import { ProjectEquipment } from '../models/project-equipment.model';
import { Project } from '../project.model';
import { ProjectsService } from '../projects.service';
import { NgxSelectoComponent } from "ngx-selecto";
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    @ViewChild('scroller', { static: false }) scroller: ElementRef;
    @ViewChild('selecto', { static: false }) selecto: NgxSelectoComponent;
    model = new Project();
    projectId : string;
    status = ProjectStatus;
    selectedProjectEquipment: ProjectEquipment = new ProjectEquipment();
    projectAreas: ProjectArea[];
    headerTubes: number[] = [];
    headerElevations: number[] = [];
    tubeSections: number[] = [];
    selectedProjectArea: ProjectArea = new ProjectArea();
    projectColorTemplates: ProjectColorTemplate[];
    projectColorTemplateParams: ProjectColorTemplateParam[];
    projectAreaMeasurement = new BehaviorSubject(new Observable<ProjectAreaMeasurement[]>());
    selectedDots: ProjectAreaMeasurement[] = [];
    elevationBatchSet = new Map<number, number>();
    lastMeasurementUpdate: string;
    ticking = false;
    scrolling = false;

  constructor(
    private projectService: ProjectsService,
    private areaService: AreaService,
    private equipmentService: EquipmentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) { 
      super();
  }
  
  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe((parameters : ParamMap)=> {
      if(parameters.has('id')) {                   
          this.projectId = parameters.get('id');

          // Project Data
          this.subs.sink = this.projectService.get(this.projectId)			
          .subscribe(
              (project) => {
                    this.model = project;
                    
                    //First Equipment/Area selection
                    if(this.model.projectEquipments && this.model.projectEquipments.length > 0) {
                        this.selectedProjectEquipment = this.model.projectEquipments[0];
                        this.projectEquipmentChange(null);
                        const projectAreasForFirstEquipment : ProjectArea[] = this.model.projectAreas.filter(pa => pa.projectEquipmentId === this.selectedProjectEquipment.projectEquipmentId);
                        if(projectAreasForFirstEquipment && projectAreasForFirstEquipment.length > 0){
                            this.selectProjectArea(projectAreasForFirstEquipment[0]);
                        }                        
                    }                    
                    
                    this.subs.sink = this.projectService.getMeasurementsMaxUpdatedDate(this.projectId)
                    .subscribe((lastMeasurementUpdate) => {
                        this.lastMeasurementUpdate = lastMeasurementUpdate ?
                               (project.updatedAt > lastMeasurementUpdate ? project.updatedAt : lastMeasurementUpdate) :
                                   project.updatedAt;
                        this.cd.markForCheck();
                    });
                    this.cd.markForCheck();                    
                },
              (error: HttpErrorResponse) => { this.showErrorNotification(); }
          ); 
      }        
    });
  }  

  editProject(){
    if(this.projectId) {
        this.router.navigate(['/projects/project', this.projectId]);
      }
  }

  equipmentReport(projectEquipmentId: string) {
    this.subs.sink = this.projectService.generateEquipmentReport(this.projectId, projectEquipmentId).subscribe(
        reportBase64 => {
            //TODO: Refactor char code array generation, check if there is a simple solution
            const byteCharacters = atob(reportBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            //const byteCharacters = Buffer.from(reportBase64, 'base64');
            
            // For URL.createObjectURL(blob) we can pass a blob or a file
            const blob = new Blob([byteArray], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
            //const file = new File([blob], 'SEE Report.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });            

            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = `${this.selectedProjectEquipment.name} - ${this.model.client}.xlsx`;
            a.click();
            URL.revokeObjectURL(objectUrl);            
        });
  }

  projectEquipmentChange(event: MatSelectChange) {
    this.projectAreas = this.model.projectAreas.filter(pa => pa.projectEquipmentId === this.selectedProjectEquipment.projectEquipmentId);
    this.selectedProjectArea = new ProjectArea();
    this.projectColorTemplates = this.model.projectColorTemplates.filter(
        pct => pct.projectEquipmentId === this.selectedProjectEquipment.projectEquipmentId);    
    
    const projectColorTemplateIds = this.projectColorTemplates.map(pct => pct['projectColorTemplateId']);
    
    this.projectColorTemplateParams = this.model.projectColorTemplateParams.filter(
        params => projectColorTemplateIds.includes(params.projectColorTemplateId));   
        
    //Reset UI Grid values
    this.clearMeasurementsGrid();
  }

  clearMeasurementsGrid(){
    this.headerTubes = [];
    this.projectAreaMeasurement.next(of([]));  
  }

  selectProjectArea(area: ProjectArea){
    // area.tubesStart = 10;
    // area.readings = 2;
    //Reset UI Grid values
    if(area.tubesStart < 1){
        area.tubesStart = 1;
    }
    this.clearMeasurementsGrid();

    this.selectedProjectArea = area;
    let subareas: SubArea[];
    this.subs.sink = this.projectService.getSubareasConfiguration(this.selectedProjectEquipment.projectEquipmentId).pipe(shareReplay())
                    .subscribe(configuration => {
                        if(configuration){
                            subareas = configuration.filter(s => s.projectAreaId === area.projectAreaId);
                            let batches = [];
                            let elevationStartEnd = [];
                            // 1 - Get Matrix boundaries (# of Elevations based on # of Batches)
                            let elevations = 0;
                            subareas.forEach(s => {
                                const batchStart = s.batchStart > s.batchEnd ? s.batchEnd : s.batchStart;
                                const batchEnd = s.batchStart > s.batchEnd ? s.batchStart : s.batchEnd;
                                
                                if(batchStart === batchEnd) {
                                    elevations += 1;
                                }else {
                                    elevations +=  (batchStart < batchEnd) ? 
                                    (batchEnd - (batchStart - 1)) : 
                                    ((batchStart - 1) - batchEnd);
                                }                            

                                // Set Batches to array
                                if (s.batchStart < s.batchEnd)
                                {
                                    for (let i = batchStart; i <= batchEnd; i++)
                                    {
                                        batches.push(!s.isBlank ? i : 0);
                                    }
                                }
                                else if (s.batchStart > s.batchEnd) {
                                    for (let i = s.batchStart; i >= s.batchEnd; i--)
                                    {
                                        batches.push(!s.isBlank ? i : 0);
                                    }
                                } else {
                                    batches.push(0);
                                }
                                
                                //TODO: IF is Blank ensure that when entering the configuration the values for Elevation Start/End are the same (1 blank row per entry in the configuration, elevation needs to be the same)

                                if(s.isBlank && s.elevationStart !== s.elevationEnd){
                                    s.elevationEnd = s.elevationStart;
                                }

                                for (let i = s.elevationStart; i <= s.elevationEnd; i++){
                                    elevationStartEnd.push(!s.isBlank ? i : 0);
                                }
                            });                        

                            // 2 - Set X axis for matrix                        
                            this.headerElevations = new Array(elevations);                        

                            // 3 - Invert Elevations, displayed from Elevation End to Start
                            for (let i = this.headerElevations.length; i > 0; i--) {        
                                this.headerElevations[this.headerElevations.length - i] = elevationStartEnd[i-1];
                                // 4 - Set Map for Elevation/Batch
                                this.elevationBatchSet.set(elevationStartEnd[i-1], batches[i-1]);
                            }                            
                            
                            // 5 - Obtain Measurements and set boundaries (# of tubes)
                            this.subs.sink = this.projectService.getMeasurements(area.projectAreaId).pipe(shareReplay())
                                .subscribe(measurements => {     
                                    if(measurements.length > 0){
                                        // Get Matrix boundaries for tubes based on the batch with max # of readings
                                        const tubes = Math.max.apply(null, measurements.map(m => m.readingsInBatch));
                                        const tubeStart = area.tubesStart > 0 ? area.tubesStart -1 : area.tubesStart;                            
                                        // Set Y axis for matrix
                                        if(this.selectedProjectEquipment.type === EquipmentTypes.Boiler){
                                            switch (area.readings) {
                                                case 1:
                                                    this.headerTubes = new Array(tubes + tubeStart);
                                                    break;
                                                case 2:
                                                case 3:
                                                    //First validation: This logic ensures that the array size based on the rounding is no lesser than number of tubes neither greater (entire 2/3 columns empty in a tube)
                                                    const tubesWithoutRounding = tubes/area.readings;
                                                    const rounding = Math.round(tubes/area.readings);
                                                    const arraySize = rounding < tubesWithoutRounding ? rounding + 1 : rounding;                                                    
                                                    this.headerTubes = new Array(arraySize + tubeStart); 
                                                    break;
                                            }
                                        } else if (this.selectedProjectEquipment.type === EquipmentTypes.Vessel){                                            
                                            this.headerTubes = new Array(tubes + tubeStart);
                                            if(area.readings !== 1){
                                                //So if by any chance readings is not 1 it is set to 1 so the grid is represented correctly by 1 reading per measurement
                                                area.readings = 1;
                                            }
                                        }
                                        
                                        this.tubeSections = new Array(area.readings);
                                        this.projectAreaMeasurement.next(of(measurements));
                                        this.cd.markForCheck();
                                    } else {
                                        // No Measurements so we clean the UI grid
                                        this.clearMeasurementsGrid();
                                    }
                                });
                        }                        
                    });    
  }

  addMeasurement(){
    const dialogRef = this.dialog.open(SubAreaComponent, {
        data: { 
            action: 'add', 
            projectAreas: this.projectAreas, 
            project: this.model,
            projectEquipmentId: this.selectedProjectEquipment.projectEquipmentId
        },
        direction: 'ltr',
        disableClose: true
      });

      this.subs.sink = dialogRef.afterClosed().subscribe((measurementConfiguration: MeasurementConfiguration) => {
          if(measurementConfiguration){
            measurementConfiguration.projectEquipmentId = this.selectedProjectEquipment.projectEquipmentId;
        
            this.subs.sink = this.projectService.importMeasurementsConfiguration(measurementConfiguration, this.selectedProjectArea.projectAreaId)
                .subscribe(
                    (responseResult: ImportResult) => {
                        if(this.selectedProjectArea){
                            this.selectProjectArea(this.selectedProjectArea);
                        }
                        
                        if(responseResult.projectAreaBatchsNotFound.length > 0) {                        
                            let batchesNotFound = '';
                            responseResult.projectAreaBatchsNotFound.forEach((projectAreaBatchNotFound: ProjectAreaBatchNotFound) => {
                                const projectArea = this.projectAreas.filter(pa => pa.projectAreaId === projectAreaBatchNotFound.projectAreaId)
                                batchesNotFound += `File not imported for Area ${projectArea[0].name}, batches not found: ${projectAreaBatchNotFound.batchsNotFound.toString()}. `;                            
                            });
    
                            this.showNotification(
                                'snackbar-danger',
                                batchesNotFound,
                                'bottom',
                                'center'
                              );
                        } else {
                            this.showNotification(
                                'snackbar-success',
                                'Files and configuration successfully imported',
                                'bottom',
                                'center'
                              );
                        }
                    },
                    (error: HttpErrorResponse) => {
                        if(error.message) {
                            this.showErrorNotification(error.message); 
                        } else {
                            this.showErrorNotification(); 
                        }                    
                    }
                ); 
          }           
      });
  }

  isMeasurementDisabled(headerElevation: number, headerTube: number, tubesStart: number){
    let batch = this.elevationBatchSet.get(headerElevation);    
    return ((headerTube * this.selectedProjectArea.readings) < ((tubesStart) * this.selectedProjectArea.readings)) || batch === 0;
  }

  clickDot(headerElevation: number, headerTube: number, calculatedTubeNumber: number, section: number, tubesStart: number, projectAreaId: string){
      let batch = this.elevationBatchSet.get(headerElevation);
      let tubeNumber = tubesStart <= 1 ? headerTube : (headerTube - ((tubesStart-1) * this.selectedProjectArea.readings));
      if(batch !== 0 && (calculatedTubeNumber * this.selectedProjectArea.readings) >= ((tubesStart) * this.selectedProjectArea.readings)){
        let measurement : ProjectAreaMeasurement;
        let initialMeasure: number = 0;
        let initialStatus: number = 0;

        this.subs.sink = this.projectAreaMeasurement.value.subscribe(measurements => {
            const filteredMeasurement = measurements.filter(measurement => 
            measurement.batch === batch && measurement.tubeNumber === tubeNumber);     
            measurement = filteredMeasurement[0];
            if(measurement){
                initialMeasure = measurement.value;
                initialStatus = measurement.status;
            }else{
                //New Measurement
                measurement = new ProjectAreaMeasurement();
                measurement.batch = batch;
                measurement.tubeNumber = tubeNumber;
                measurement.elevation = headerElevation;
                measurement.projectAreaId = projectAreaId;
                measurement.tubeSection = section;
            }            
        });

        const dialogRef = this.dialog.open(DotEditorComponent, {
            data: { 
                measurement: measurement, 
                project: this.model, 
                projectEquipment: this.selectedProjectEquipment,
                projectArea: this.selectedProjectArea,
                section: section,
                tubeNumber: calculatedTubeNumber
            },
            direction: 'ltr',
            disableClose: true
        });

        this.subs.sink = dialogRef.afterClosed().subscribe((measurement: ProjectAreaMeasurement) => { 
            if (measurement && (measurement.value !== initialMeasure || measurement.status !== initialStatus)) {
                if(!measurement.projectAreaMeasurementId){
                    //New Measurement
                    this.subs.sink = this.projectService.addMeasurement(measurement)
                    .subscribe(
                        (newMeasurement) => {
                            //Update Measurements Grid
                            this.subs.sink = this.projectAreaMeasurement.value.subscribe(measurements => {
                                measurements.push(newMeasurement);
                                this.projectAreaMeasurement.next(of(measurements));
                                this.cd.markForCheck();           
                            });
                            this.showNotification(
                                'snackbar-success',
                                'Measurement successfully added',
                                'bottom',
                                'center'
                            );
                        },
                        (error: HttpErrorResponse) => {
                            this.showErrorNotification();
                        }
                    ); 
                }else{
                    const measurementArray = Array.of(measurement);
                    this.subs.sink = this.projectService.enableDots(measurementArray)
                    .subscribe(
                        (updatedProjectAreaMeasurementStatus) => {
                            this.subs.sink = this.projectAreaMeasurement.value.subscribe(measurements => {
                                const updatedMeasurement = measurements.filter(m => m.projectAreaMeasurementId === measurement.projectAreaMeasurementId);
                                if(updatedMeasurement[0]){
                                    updatedMeasurement[0].status = measurement.status;
                                }
                                this.cd.markForCheck();           
                            });
                            
                            this.showNotification(
                                'snackbar-success',
                                'Measurement successfully updated',
                                'bottom',
                                'center'
                            );
                        },
                        (error: HttpErrorResponse) => {
                            measurement.value = initialMeasure;
                            measurement.status = initialStatus;
                            this.showErrorNotification();
                        }
                    ); 
                }
            }
        });
      }
  }

  getMeasurementId(headerElevation: number, headerTube: number, section: number, tubesStart: number) : Observable<string> {
    let measurement : ProjectAreaMeasurement[];
    let value : string = '';
    let batch = this.elevationBatchSet.get(headerElevation);
    let tubeNumber = tubesStart <= 1 ? headerTube : (headerTube - ((tubesStart-1) * this.selectedProjectArea.readings));    

    if(batch !== 0) {
        this.subs.sink = this.projectAreaMeasurement.value.subscribe(measurements => {
            measurement = measurements.filter(measurement => 
                measurement.batch === batch && measurement.tubeNumber === tubeNumber);    
            value = measurement[0] && measurement[0].projectAreaMeasurementId;
        });
    }
    return of(value);   
  }

  getMeasureValue(headerElevation: number, headerTube: number, section: number, tubesStart: number) : Observable<string> {
    let measurement : ProjectAreaMeasurement[];
    let value : string = '';
    let batch = this.elevationBatchSet.get(headerElevation);
    let tubeNumber = tubesStart <= 1 ? headerTube : (headerTube - ((tubesStart-1) * this.selectedProjectArea.readings));    

    if(batch !== 0) {
        this.subs.sink = this.projectAreaMeasurement.value.subscribe(measurements => {
            measurement = measurements.filter(measurement => 
                measurement.batch === batch && measurement.tubeNumber === tubeNumber);    
            value = measurement[0] && measurement[0].status === 0 ? measurement[0].value.toFixed(2) : '';
        });
    }
    return of(value);
  }

  getCellColor(headerElevation: number, headerTube: number, section: number, tubesStart: number) : Observable<string> {      
    let templateParam : ProjectColorTemplateParam[];
    let color: string;
    let batch = this.elevationBatchSet.get(headerElevation);
    let tubeNumber = tubesStart <= 1 ? headerTube : (headerTube - ((tubesStart-1) * this.selectedProjectArea.readings));  
    if(batch !== 0) {    
        this.subs.sink = this.projectAreaMeasurement.value.subscribe(measurements => {
            const measure = measurements.filter(
                measurement => measurement.batch === batch && measurement.tubeNumber === tubeNumber);    
            
            if(measure && measure[0]){
                templateParam = this.projectColorTemplateParams.filter(param => param.minValue <= Math.round(measure[0].value) && param.maxValue >= Math.round(measure[0].value));
            
                // Case when a minValue is set but not the maxValue (example: minValue = 20, maxValue = 0... all values from 20 and up will match)
                if(templateParam.length === 0){
                    templateParam = this.projectColorTemplateParams.filter(param => param.minValue <= Math.round(measure[0].value) && param.maxValue === 0);
                }
    
                color = measure[0].status === 0 ? templateParam[0]?.color : '#fff';
            }            
        });
    }
    return of(color);
  }

  disableSelectedDots(){
    this.switchSelectedDotsStatus();      
    this.subs.sink = this.projectService.enableDots(this.selectedDots)
    .subscribe(
        (updatedProjectAreaMeasurementStatuses) => {
            this.showNotification(
                'snackbar-success',
                'Measurements successfully updated',
                'bottom',
                'center'
                );
        },
        (error: HttpErrorResponse) => { 
            this.switchSelectedDotsStatus();
            this.showErrorNotification(); 
        }
    );
  }

  switchSelectedDotsStatus(){
    this.selectedDots.forEach(dot => {
        dot.status = dot.status === 0 ? 1 : 0;
      });
  }

  addArea(equipmentId: string, equipmentType: number) {
    const dialogRef = this.dialog.open(AreaComponent, {
        data: {
            equipmentId: equipmentId,
            equipmentType: equipmentType,
            action: 'add'
        },
        direction: 'ltr'
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((area) => {         
        if (area) {
            this.subs.sink = this.areaService.addAreaToProject(area, this.selectedProjectEquipment.projectEquipmentId, this.model.projectId)
            .subscribe(
                (newProjectArea) => {
                    this.model.projectAreas.push(newProjectArea);
                    this.projectAreas.push(newProjectArea);
                    
                    this.showNotification(
                        'snackbar-success',
                        'Area successfully added',
                        'bottom',
                        'center'
                        );
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );             
        }
    });
  }

  addEquipment(locationId: string) {
    const dialogRef = this.dialog.open(EquipmentComponent, {
        data: {
            locationId: locationId,
            action: 'add',
            showColorTemplate: true
        },
        direction: 'ltr'
      });

      this.subs.sink = dialogRef.afterClosed().subscribe((equipmentTemplate: EquipmentColorTemplate) => {       
        if (equipmentTemplate) {            
            this.subs.sink = this.equipmentService.addEquipmentToProject(equipmentTemplate, this.model.projectId)
            .subscribe(
                (newProjectEquipmentColorTemplate: ProjectEquipmentColorTemplate) => {
                    if(!this.projectColorTemplates) {
                        this.projectColorTemplates = [];
                    }

                    if(!this.projectColorTemplateParams) {
                        this.projectColorTemplateParams = [];
                    }

                    this.model.projectEquipments.push(newProjectEquipmentColorTemplate.projectEquipment);
                    this.model.projectColorTemplates.push(newProjectEquipmentColorTemplate.projectColorTemplate);
                    this.model.projectColorTemplateParams.push(...newProjectEquipmentColorTemplate.projectColorTemplateParams);                 

                    this.showNotification(
                        'snackbar-success',
                        'Equipment successfully added',
                        'bottom',
                        'center'
                      );
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );             
        }
      });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  showErrorNotification(message? : string) {
    this.showNotification(
        'snackbar-danger',
        message ? message : 'An error occurred, please try again.',
        'bottom',
        'center'
      );
  }

    //NGX Selecto    
    onSelect(e) {
        e.added.forEach(el => {
            el.classList.add("selected");
            if(el.id){
                this.subs.sink = this.projectAreaMeasurement.value.subscribe(measurements => {
                    const filteredMeasurement = measurements.filter(measurement => 
                    measurement.projectAreaMeasurementId === el.id);     
                    if(filteredMeasurement[0]){
                        this.selectedDots.push(filteredMeasurement[0]);
                    }          
              });
            }           
        });
        e.removed.forEach(el => {
            el.classList.remove("selected");
            if(el.id && this.selectedDots.some(m => m.projectAreaMeasurementId === el.id)){
                this.selectedDots = this.selectedDots.filter(m => m.projectAreaMeasurementId !== el.id);
            }            
        });
    }

}
