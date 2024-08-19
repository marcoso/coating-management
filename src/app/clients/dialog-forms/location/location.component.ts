import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Location } from '../../models/location.model';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    model : Location;
    action : string;
    isDetails = false;
    dialogTitle: string;
    locationForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public locationService: LocationService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) { 

    super();
    // Set the defaults
    this.action = data.action;    
    this.model = new Location();

    if (this.action === 'add') {
        this.isDetails = false;
        this.dialogTitle = 'New';        
        this.locationForm = this.createForm();
    } else if (this.action === 'edit') {
        this.isDetails = false;
        this.dialogTitle = 'Edit';        
        this.locationForm = this.createForm();
        this.setLocation(data.locationId, data.clientId);
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
      mainContact: [this.model.mainContact,[Validators.required]]
    });
  }

  setLocation(locationId: string, clientId: string) {            
      this.subs.sink = this.locationService.getByLocationId(locationId, clientId).subscribe(location => this.model = location);            
  }

  cancelClick() : void {
      this.dialogRef.close();
  }

  onSubmit() {
    // Model with Location data is passed as a result in the mat-dialog-close attribute so the opener can receive the data
  }

}
