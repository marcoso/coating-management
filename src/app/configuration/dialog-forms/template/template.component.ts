import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { ColorTemplate } from '../../models/color-template.model';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    model : ColorTemplate;
    action : string;
    isDetails = false;
    dialogTitle: string;
    templateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public configurationService: ConfigurationService,
    private formBuilder: FormBuilder) { 

    super();
    // Set the defaults
    this.action = data.action;    
    this.model = new ColorTemplate();

    if (this.action === 'add') {
        this.isDetails = false;
        this.dialogTitle = 'New';        
        this.templateForm = this.createForm();
    } else if (this.action === 'edit') {
        this.isDetails = false;
        this.dialogTitle = 'Edit'; 
        this.templateForm = this.createForm();
        this.setTemplate(data.colorTemplateId);
    } else if (this.action === 'details') {
        this.isDetails = true;            
        this.dialogTitle = '';            
    }
  }

  ngOnInit(): void {
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.model.name, [Validators.required]]
    });
  }

  setTemplate(colorTemplateId: string) {            
    this.subs.sink = this.configurationService.getById(colorTemplateId).subscribe(template => this.model = template);            
  }

  cancelClick() : void {
      this.dialogRef.close();
  }

  onSubmit() {
    // Model with Template data is passed as a result in the mat-dialog-close attribute so the opener can receive the data
  }

}

