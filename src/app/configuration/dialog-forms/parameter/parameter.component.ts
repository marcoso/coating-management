import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { ColorTemplateParam } from '../../models/color-template-param.model';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    model : ColorTemplateParam;
    action : string;
    isDetails = false;
    dialogTitle: string;
    templateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ParameterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public configurationService: ConfigurationService,
    private formBuilder: FormBuilder) { 

    super();
    // Set the defaults
    this.action = data.action;    
    this.model = new ColorTemplateParam();

    if (this.action === 'add') {
        this.isDetails = false;
        this.dialogTitle = 'New';        
        this.templateForm = this.createForm();
        this.model.colorTemplateId = data.colorTemplateId;
    } else if (this.action === 'edit') {
        this.isDetails = false;
        this.dialogTitle = 'Edit'; 
        this.templateForm = this.createForm();
        this.setTemplate(data.colorTemplateId, data.colorTemplateParamId);
    } else if (this.action === 'details') {
        this.isDetails = true;            
        this.dialogTitle = '';            
    }
  }

  ngOnInit(): void {
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      color: [this.model.color, [Validators.required]],
      minValue: [this.model.minValue, [Validators.required]],
      maxValue: [this.model.maxValue, [Validators.required]],
      reference: [this.model.reference, [Validators.required]]
    });
  }

  setTemplate(colorTemplateId: string, colorTemplateParamId: string) {            
    this.subs.sink = this.configurationService.getParamById(colorTemplateId, colorTemplateParamId).subscribe(parameter => this.model = parameter);            
  }

  cancelClick() : void {
      this.dialogRef.close();
  }

  onSubmit() {
    // Model with Parameter data is passed as a result in the mat-dialog-close attribute so the opener can receive the data
  }

}