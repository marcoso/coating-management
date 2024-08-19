import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, shareReplay } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import Swal from 'sweetalert2';
import { ParameterComponent } from '../dialog-forms/parameter/parameter.component';
import { TemplateComponent } from '../dialog-forms/template/template.component';
import { ColorTemplateParam } from '../models/color-template-param.model';
import { ColorTemplate } from '../models/color-template.model';
import { ConfigurationService } from '../services/configuration.service';

@Component({
  selector: 'app-color-description-templates',
  templateUrl: './color-description-templates.component.html',
  styleUrls: ['./color-description-templates.component.scss']
})
export class ColorDescriptionTemplatesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    colorTemplates = new BehaviorSubject(new Observable<ColorTemplate[]>());

    constructor(
            private configurationService: ConfigurationService,
            private router: Router,
            public dialog: MatDialog,
            private snackBar: MatSnackBar) {
            super();
            }

    ngOnInit(): void {
        const allColorTemplates = this.configurationService.getColorTemplates().pipe(shareReplay());
        this.subs.sink = allColorTemplates.subscribe(templates => {
            templates.forEach(template => {
                if(!template.parameters) {
                    this.subs.sink = this.configurationService.getColorTemplateParameters(template.colorTemplateId).pipe(shareReplay()).subscribe(
                        parameters => template.parametersSubject = new BehaviorSubject(of(parameters))
                    );
                } else {
                    template.parametersSubject = new BehaviorSubject(of(template.parameters));
                }                
            });
        });        
        this.colorTemplates.next(allColorTemplates);        
    }

    addColorDescriptionTemplate() {
        const dialogRef = this.dialog.open(TemplateComponent, {
            data: {
                action: 'add'
            },
            direction: 'ltr'
        });
    
        this.subs.sink = dialogRef.afterClosed().subscribe((template) => {          
            if (template) {
                this.subs.sink = this.configurationService.add(template).pipe(shareReplay())
                .subscribe(
                    (colorTemplate) => {
                        if(colorTemplate){
                            this.subs.sink = this.colorTemplates.value.subscribe(colorTemplates => {
                                if(!colorTemplate.parametersSubject){
                                    colorTemplate.parametersSubject = new BehaviorSubject(of([]));
                                }

                                colorTemplates.push(colorTemplate);                                
                                this.colorTemplates.next(of(colorTemplates));
                            });

                            this.showNotification(
                                'snackbar-success',
                                'Color Description Template successfully added',
                                'bottom',
                                'center'
                              );
                        } else {
                            this.showErrorNotification();
                        }
                    },
                    (error: HttpErrorResponse) => { this.showErrorNotification(); }
                );             
            }
        });
    }

    editColorDescriptionTemplate(colorTemplateId: string){
        const dialogRef = this.dialog.open(TemplateComponent, {
            data: {                            
                action: 'edit',
                colorTemplateId: colorTemplateId
            },
            direction: 'ltr'
          });
    
          this.subs.sink = dialogRef.afterClosed().subscribe((template) => {          
            if (template) {    
                this.subs.sink = this.configurationService.update(template).pipe(shareReplay())
                .subscribe(
                    (updatedTemplate) => {                    
                        this.subs.sink = this.colorTemplates.value.subscribe(templates => {
                            if(!updatedTemplate.parametersSubject){
                                updatedTemplate.parametersSubject = new BehaviorSubject(of(updatedTemplate.parameters));
                            }                                      
                            const filteredTemplates = templates.filter(colorTemplate => colorTemplate.colorTemplateId !== updatedTemplate.colorTemplateId);             
                            filteredTemplates.push(updatedTemplate);
                            this.colorTemplates.next(of(filteredTemplates));
                        });
                        
                        this.showNotification(
                            'snackbar-success',
                            'Color Description Template successfully updated',
                            'bottom',
                            'center'
                          );
                    },
                    (error: HttpErrorResponse) => { this.showErrorNotification(); }
                );             
            }
          });
    }

    deleteColorDescriptionTemplate(colorTemplateId: string) {
        Swal.fire({                
            text: "Are you sure you want to remove the Template?",                
            showCancelButton: true,
            confirmButtonColor: '#EF473A',
            cancelButtonColor: '#0198F1',
            confirmButtonText: 'Remove'
          }).then((result) => {
            if (result.isConfirmed) {                    
                this.subs.sink = this.configurationService.delete(colorTemplateId).pipe(shareReplay())
                .subscribe(
                    (result) => {             
                        this.showNotification(
                            'snackbar-success',
                            'Template successfully removed',
                            'bottom',
                            'center'
                        );
    
                        // After deleting the Template we update the list in memory by also removing the Template
                        const remainingTemplates = this.colorTemplates.value.pipe(map(colorTemplates => colorTemplates.filter(template => template.colorTemplateId !== colorTemplateId)));                 
                        this.colorTemplates.next(remainingTemplates);
                    },
                    (error: HttpErrorResponse) => { this.showErrorNotification(); }
                );                  
            }
        });
    }

    addParameter(colorTemplateId: string){
        const dialogRef = this.dialog.open(ParameterComponent, {
            data: {
                action: 'add',
                colorTemplateId: colorTemplateId
            },
            direction: 'ltr'
        });
    
        this.subs.sink = dialogRef.afterClosed().subscribe((parameter) => {   
            if (parameter) {
                this.subs.sink = this.configurationService.addParameter(parameter).pipe(shareReplay())
                .subscribe(
                    (newParameter) => {
                        this.subs.sink = this.colorTemplates.value.pipe(
                            map(templates => templates.filter(template => template.colorTemplateId === colorTemplateId))
                        )
                        .subscribe(template => {
                            if(!template[0].parametersSubject){
                                template[0].parametersSubject = new BehaviorSubject(of([]));
                            }

                            template[0].parametersSubject.value.subscribe(
                                params => {
                                    params.push(newParameter);
                                    template[0].parametersSubject.next(of(params));
                                });  
                                                          
                            this.colorTemplates.next(this.colorTemplates.value);
                        });                        
                        
                        this.showNotification(
                            'snackbar-success',
                            'Parameter successfully added',
                            'bottom',
                            'center'
                          );
                    },
                    (error: HttpErrorResponse) => { this.showErrorNotification(); }
                );             
            }
        });
    }

    editParameter(colorTemplateId: string, colorTemplateParamId: string){
        const dialogRef = this.dialog.open(ParameterComponent, {
            data: {
                action: 'edit',
                colorTemplateId: colorTemplateId,
                colorTemplateParamId: colorTemplateParamId
            },
            direction: 'ltr'
        });
    
        this.subs.sink = dialogRef.afterClosed().subscribe((parameter) => { 
            if (parameter) {
                this.subs.sink = this.configurationService.updateParameter(parameter).pipe(shareReplay())
                .subscribe(
                    (updatedParameter) => {
                        
                        // Reload of Parameter in a Template
                        this.subs.sink = this.colorTemplates.value.pipe(
                            map(templates => templates.filter(template => template.colorTemplateId === updatedParameter.colorTemplateId))
                        )
                        .subscribe(template => {
                            const filteredParameters = template[0].parametersSubject.value.pipe(map(params => params.filter(param => param.colorTemplateParamId !== updatedParameter.colorTemplateParamId)));
                            filteredParameters.subscribe(parameters => {
                                parameters.push(updatedParameter);
                                template[0].parametersSubject.next(of(parameters));
                                this.colorTemplates.next(this.colorTemplates.value);
                            });                            
                            
                        });
                        
                        this.showNotification(
                            'snackbar-success',
                            'Parameter successfully updated',
                            'bottom',
                            'center'
                          );
                    },
                    (error: HttpErrorResponse) => { this.showErrorNotification(); }
                );             
            }
        });
    }

    deleteParameter(colorTemplateId: string, colorTemplateParamId: string){
        Swal.fire({                
            text: "Are you sure you want to remove the Parameter?",                
            showCancelButton: true,
            confirmButtonColor: '#EF473A',
            cancelButtonColor: '#0198F1',
            confirmButtonText: 'Remove'
          }).then((result) => {
            if (result.isConfirmed) {     
                this.subs.sink = this.configurationService.deleteParameter(colorTemplateId, colorTemplateParamId).pipe(shareReplay())
                .subscribe(
                    (result) => { 
                        this.subs.sink = this.colorTemplates.value.pipe(
                            map(templates => templates.filter(template => template.colorTemplateId === colorTemplateId))
                        )
                        .subscribe(template => {                                                                                    
                            let remainingParameters = template[0].parametersSubject.value.pipe(map(params => params.filter(param => param.colorTemplateParamId !== colorTemplateParamId)));                            
                            template[0].parametersSubject.next(remainingParameters);
                            this.colorTemplates.next(this.colorTemplates.value);
                        });

                        this.showNotification(
                            'snackbar-success',
                            'Parameter successfully removed',
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
