import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Client } from '../models/client.model';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {    
    selected = 'active';
    model = new Client();
    clientId : string;

  constructor(
    public clientService: ClientService, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar) { 
        this.model.isActive = true;
        // Default Values
        this.model.specifiedAverageThickness = 16;
        this.model.minorThicknessToleranceStart = -10;
        this.model.minorThicknessToleranceEnd = 100;
        this.model.majorThicknessToleranceStart = -40;
        this.model.majorThicknessToleranceEnd = 200;
    }

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe((parameters : ParamMap)=> {
        if(parameters.has('id')) {                   
            this.clientId = parameters.get('id');
            this.clientService.get(this.clientId)			
            .subscribe(
                (client) => {
                    this.model = client;            
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );            
        }        
      });
  }

  onSubmit() { 
      if (this.clientId) {          
        this.clientService.update(this.model)			
        .subscribe(
          (data) => {          
            this.showNotification(
                'snackbar-success',
                'Client successfully updated',
                'bottom',
                'center'
            );  
              this.router.navigate(['clients']);
          },
          (error: HttpErrorResponse) => { this.showErrorNotification(); }
        );
      } else {          
        this.clientService.add(this.model)			
        .subscribe(
          (data) => {
            this.showNotification(
                'snackbar-success',
                'Client successfully added',
                'bottom',
                'center'
            );
              this.router.navigate(['clients']);
          },
          (error: HttpErrorResponse) => { this.showErrorNotification(); }
        );
      }      
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
