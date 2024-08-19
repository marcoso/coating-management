import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ColorTemplateParam } from 'src/app/configuration/models/color-template-param.model';
import { ColorTemplate } from 'src/app/configuration/models/color-template.model';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { BoilerSubTypes } from 'src/app/core/enums/boiler-sub-types';
import { EquipmentTypes } from 'src/app/core/enums/equipment-types';
import { VesselSubTypes } from 'src/app/core/enums/vessel-sub-types';
import { EquipmentColorTemplate } from 'src/app/projects/models/equipment-color-template.model';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Equipment } from '../../models/equipment.model';
import { EquipmentService } from '../../services/equipment.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    model : Equipment;
    modelEquipmentTemplate: EquipmentColorTemplate;
    colorTemplateId: string;
    action : string;
    isDetails = false;
    showColorTemplate = false;
    dialogTitle: string;
    equipmentForm: FormGroup;
    equipmentTypes = EquipmentTypes;
    boilerSubTypes = BoilerSubTypes;
    vesselSubTypes = VesselSubTypes;
    equipmentTypeKeys = [];
    boilerSubTypeKeys = [];
    vesselSubTypeKeys = [];
    @ViewChild(MatSelect, { static: true }) boilerSubTypeDropdown: MatSelect;
    @ViewChild(MatSelect, { static: true }) vesselSubTypeDropdown: MatSelect;
    colorDescriptionTemplates = new Observable<ColorTemplate[]>();
    colorTemplateParams= new Observable<ColorTemplateParam[]>();

    constructor(
        public dialogRef: MatDialogRef<EquipmentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private equipmentService: EquipmentService,
        private configurationService: ConfigurationService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar) {        
            super();

            this.setEquipmentTypes();
            // Set the defaults
            this.action = data.action;    
            this.model = new Equipment();
            this.model.locationId = data.locationId;        
            this.equipmentForm = this.createForm();

            if (this.action === 'add') {
                this.isDetails = false;
                this.dialogTitle = 'New';                    
            } else if (this.action === 'edit') {
                this.isDetails = false;
                this.dialogTitle = 'Edit';  
                this.setEquipment(data.equipmentId, data.locationId);
            } else if (this.action === 'details') {
                this.isDetails = true;            
                this.dialogTitle = '';            
            }

            if(data.showColorTemplate){
                this.showColorTemplate = true;
            }
    }

    ngOnInit(): void {
        this.colorDescriptionTemplates = this.configurationService.getColorTemplates();
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            name: [this.model.name, [Validators.required]], 
            type: [this.model.type,[Validators.required]],
            subType: [this.model.subType,[Validators.required]],
            equipmentDate: [this.model.equipmentDate, [Validators.required]],
            scopeDescription: [this.model.scopeDescription,[Validators.required]]
        });
    }

    setEquipmentTypes(){
        // Values for the dropdowns
        this.equipmentTypeKeys = Object.keys(this.equipmentTypes).filter(type => !isNaN(Number(type))).map(Number);       
        this.boilerSubTypeKeys = Object.keys(this.boilerSubTypes).filter(subType => !isNaN(Number(subType))).map(Number);       
        this.vesselSubTypeKeys = Object.keys(this.vesselSubTypes).filter(subType => !isNaN(Number(subType))).map(Number);       
    }

    setEquipment(equipmentId: string, locationId: string) {            
        this.subs.sink = this.equipmentService.getById(locationId, equipmentId).subscribe(equipment => this.model = equipment);            
    }
    
    cancelClick() : void {
        this.dialogRef.close();
    }

    onSubmit() {
        // Model with Equipment data is passed as a result in the mat-dialog-close attribute so the opener can receive the data        
    }

    getModel(){
        this.modelEquipmentTemplate = new EquipmentColorTemplate();
        this.modelEquipmentTemplate.model = this.model;
        this.modelEquipmentTemplate.colorTemplateId = this.colorTemplateId;
        return this.modelEquipmentTemplate;
    }

    onChange(event: MatSelectChange) {        
        this.model.subType = null;
    }

    onBoilerSubTypeChange(event: MatSelectChange) {        
        if(event.value !== BoilerSubTypes.Other){
            this.model.subTypeName = '';
        }
    }

    onVesselSubTypeChange(event: MatSelectChange) {        
        if(event.value !== VesselSubTypes.Other){
            this.model.subTypeName = '';
        }
    }

    templateChange(event: MatSelectChange) {
        this.setEquipmentTemplate(event.value);
    }

    setEquipmentTemplate(colorTemplateId: string){
        this.colorTemplateParams = this.configurationService.getColorTemplateParameters(colorTemplateId);    
    }
}