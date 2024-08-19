import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MeasurementHistorical } from '../../models/measurement-historical.model';
import { ProjectAreaMeasurement } from '../../models/project-area-measurement.model';
import { ProjectArea } from '../../models/project-area.model';
import { ProjectEquipment } from '../../models/project-equipment.model';
import { Project } from '../../project.model';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-dot-editor',
  templateUrl: './dot-editor.component.html',
  styleUrls: ['./dot-editor.component.scss']
})
export class DotEditorComponent  extends UnsubscribeOnDestroyAdapter implements OnInit {        
    measureEditForm: FormGroup;  
    dialogTitle: string;       
    measurement = new ProjectAreaMeasurement();
    project = new Project();
    projectEquipment = new ProjectEquipment();
    projectArea: ProjectArea;
    section: number;
    tubeNumber: number;
    measureEnabled = false;
    initialMeasurementValue = 0;
    initialStatus: number = 0;
    previousMeasurements = new BehaviorSubject(new Observable<MeasurementHistorical[]>());

    constructor(
    public dialogRef: MatDialogRef<DotEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private projectService: ProjectsService) {
        super();
        // Set the defaults
        this.project = data.project;
        this.projectEquipment = data.projectEquipment;
        this.projectArea = data.projectArea;
        this.section = data.section;
        this.tubeNumber = data.tubeNumber;
        if(data.measurement){
            this.measurement = data.measurement;
            this.initialMeasurementValue = this.measurement.value;
            this.initialStatus = this.measurement.status;
            if(data.measurement.projectAreaMeasurementId) {
                this.subs.sink = this.projectService.getMeasurementsHistorical(
                    data.measurement.projectAreaMeasurementId,
                    data.projectEquipment.projectEquipmentId,
                    data.measurement.projectAreaId,
                    data.measurement.elevation,
                    data.measurement.tubeNumber,
                    data.project.startDate)
                .subscribe(
                    (measurementsHistorical) => {        
                        this.previousMeasurements.next(of(measurementsHistorical));
                    },
                    (error: HttpErrorResponse) => {
                        this.showErrorNotification();
                    }
                );
            }              
        }
    }

    ngOnInit(): void {
    }
    
    disableDot(){
        this.measurement.status = this.measurement.status === 0 ? 1 : 0;
    }

    getSection(): string {
        switch (this.projectArea.readings) {
            case 1:
                return '';
            case 2:
                return this.section === 0 ? '(L)' : '(R)';
            case 3:
                return this.section === 0 ? '(L)' : (this.section === 1 ? '(C)' : '(R)');
        }
    }
        
    cancelClick() : void {      
        this.measurement.value = this.initialMeasurementValue;
        this.measurement.status = this.initialStatus;  
        this.dialogRef.close();
    }

    onSubmit() {
    // Data is passed as a result in the mat-dialog-close attribute so the opener can receive it
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
