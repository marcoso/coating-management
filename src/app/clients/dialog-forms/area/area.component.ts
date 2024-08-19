import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElevationUnits } from 'src/app/core/enums/elevation-units';
import { EquipmentTypes } from 'src/app/core/enums/equipment-types';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Area } from '../../models/area.model';
import { AreaService } from '../../services/area.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    model : Area;
    action : string;
    isDetails = false;
    dialogTitle: string;
    areaForm: FormGroup;
    elevationUnits = ElevationUnits;
    elevationUnitKeys = [];
    equipmentType: number;

    constructor(
    public dialogRef: MatDialogRef<AreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public areaService: AreaService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) {
        super();

        this.setDropdownKeys();
        // Set the defaults
        this.action = data.action;    
        this.model = new Area();
        this.model.equipmentId = data.equipmentId;
        this.equipmentType = data.equipmentType;        
        this.areaForm = this.createForm();

        if(data.equipmentType === EquipmentTypes.Vessel){
            //this.model.elevationIncrement = 1;
            this.model.readings = 1;
        }

        if (this.action === 'add') {
            this.isDetails = false;
            this.dialogTitle = 'New';                    
        } else if (this.action === 'edit') {
            this.isDetails = false;
            this.dialogTitle = 'Edit';     
            this.setArea(data.areaId, data.equipmentId);
        } else if (this.action === 'details') {
            this.isDetails = true;            
            this.dialogTitle = '';            
        }
    }

    ngOnInit(): void {
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            name: [this.model.name, [Validators.required]], 
            elevationUnit: [this.model.elevationUnit,[Validators.required]],            
            //elevationIncrement: [this.model.elevationIncrement, [Validators.required]],
            tubeDiameter: [this.model.tubeDiameter,[Validators.required]],
            readings: [this.model.readings,[Validators.required]],
            tubesStart: [this.model.tubesStart,[Validators.required, Validators.min(1)]],
            tubesEnd: [this.model.tubesEnd,[Validators.required]],
            referenceX: [this.model.referenceX,[Validators.required]],
            referenceY: [this.model.referenceY,[Validators.required]]
        });
    }

    setArea(areaId: string, equipmentId: string) {            
        this.subs.sink = this.areaService.getById(areaId, equipmentId).subscribe(area => this.model = area);            
    }

    setDropdownKeys(){
        // Values for the dropdowns
        this.elevationUnitKeys = Object.keys(this.elevationUnits).filter(type => !isNaN(Number(type))).map(Number);      
    }    
    
    cancelClick() : void {
        this.dialogRef.close();
    }

    onSubmit() {
    // Model with Area data is passed as a result in the mat-dialog-close attribute so the opener can receive the data
    }
}