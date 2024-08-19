import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { ReportFile } from '../../models/report-file.model';
import { Project } from '../../project.model';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent extends UnsubscribeOnDestroyAdapter implements OnInit {        
  addReportForm: FormGroup;  
  dialogTitle: string;
  model: ReportFile;
  projects: Observable<Project[]>;      

  constructor(
  public dialogRef: MatDialogRef<AddReportComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,    
  private formBuilder: FormBuilder,
  private snackBar: MatSnackBar,
  private projectService: ProjectsService) {
      super();
      // Set the defaults
      this.model = new ReportFile();
      this.projects = this.projectService.getMyProjectsList();
        
  }

  ngOnInit(): void {
  }
      
  cancelClick() : void {
      this.dialogRef.close();
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      this.model.file = event.target.files[0];                   
    } else {
      // User removed the file from the fileinput so we need to remove the mappings
      this.model.file = null;
    }    
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
