import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SubArea } from 'src/app/clients/models/sub-area.model';
import { AreaService } from 'src/app/clients/services/area.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MeasurementConfiguration } from '../../models/measurement-configuration.model';
import { ProjectArea } from '../../models/project-area.model';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-sub-area',
  templateUrl: './sub-area.component.html',
  styleUrls: ['./sub-area.component.scss']
})
export class SubAreaComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    model : ProjectArea[];
    action : string;
    isDetails = false;
    dialogTitle: string;
    areaForm: FormGroup;    
    subAreas: SubArea[] = [];
    subAreasSubject = new BehaviorSubject(new Observable<SubArea[]>());
    subAreaId = 0;    
    configurationModel = new MeasurementConfiguration();
    projectAreaFileSet = new Map<string, File>();
    projectAreaOriginalFileNameSet = new Map<string, string>();

    constructor(
    public dialogRef: MatDialogRef<SubAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectsService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) {
        super();

        // Set the defaults
        this.action = data.action;
        this.model = data.projectAreas;      
        this.areaForm = this.createForm();
        this.setSubAreasConfiguration(data.projectEquipmentId);

        if (this.action === 'add') {
            this.isDetails = false;
            this.dialogTitle = 'Add';                    
        } else if (this.action === 'edit') {
            this.isDetails = false;
            this.dialogTitle = 'Edit';     
        } else if (this.action === 'details') {
            this.isDetails = true;            
            this.dialogTitle = '';            
        }
    }

    ngOnInit(): void {
    }

    createForm(): FormGroup {
        return this.formBuilder.group({});
    }

    setSubAreasConfiguration(projectEquipmentId: string){
        this.subs.sink = this.projectService.getSubareasConfiguration(projectEquipmentId).subscribe(configuration => {
            if(configuration){
                this.subAreas = configuration;
            }
            this.subAreasSubject.next(of(this.subAreas));
        });
    }

    addSubarea(area: ProjectArea) {
        this.subAreaId++;  
        let subarea = new SubArea();
        subarea.subAreaId = this.subAreaId.toString();
        subarea.projectAreaId = area.projectAreaId;
        this.subAreas.push(subarea);
        this.subAreasSubject.next(of(this.subAreas));
    }

    deleteSubarea(subAreaId: string){
        this.subAreas = this.subAreas.filter(subarea => subarea.subAreaId !== subAreaId);
        this.subAreasSubject.next(of(this.subAreas));
    }

    getSubAreasByArea(area: ProjectArea) : Observable<SubArea[]> {
        let filteredSubareas : SubArea[];
        this.subAreasSubject.value.subscribe(subareas => {
            filteredSubareas = subareas.filter(subarea => subarea.projectAreaId === area.projectAreaId)            
        });
        return of(filteredSubareas);
    }

    onFileChange(event, projectAreaId: string) {
        if(event.target.files.length > 0) {
            let fileExist : boolean = false;

            for (const file of this.projectAreaFileSet.values()) {
                if(file.name === event.target.files[0].name){
                    fileExist = true;
                }
            }

            if(fileExist){
                const randomName = Date.now().toString() + '-';
                const newName = randomName + event.target.files[0].name;
                var blob = event.target.files[0].slice(0, event.target.files[0].size, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'); 
                var newFile = new File([blob], newName, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
                this.projectAreaFileSet.set(projectAreaId, newFile);
                this.projectAreaOriginalFileNameSet.set(projectAreaId, event.target.files[0].name);
            }else{
                this.projectAreaFileSet.set(projectAreaId, event.target.files[0]);
            }            
        } else {
            // User removed the file from the fileinput so we need to remove the mappings
            this.projectAreaFileSet.delete(projectAreaId);
            this.projectAreaOriginalFileNameSet.delete(projectAreaId);
        }        
    }
    
    cancelClick() : void {
        this.dialogRef.close();
    }

    onSubmit() {
        // Model with File and Subareas data is passed as a result in the mat-dialog-close attribute so the opener can receive the data
        this.configurationModel.projectAreaFileSet = this.projectAreaFileSet;
        this.configurationModel.projectAreaOriginalFileNameSet = this.projectAreaOriginalFileNameSet;
        this.configurationModel.subAreas = this.subAreas;        
    }
}
