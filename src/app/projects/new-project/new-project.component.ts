import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, shareReplay } from 'rxjs';
import { Client } from 'src/app/clients/models/client.model';
import { Equipment } from 'src/app/clients/models/equipment.model';
import { Location } from 'src/app/clients/models/location.model';
import { AreaService } from 'src/app/clients/services/area.service';
import { ClientService } from 'src/app/clients/services/client.service';
import { EquipmentService } from 'src/app/clients/services/equipment.service';
import { LocationService } from 'src/app/clients/services/location.service';
import { ColorTemplate } from 'src/app/configuration/models/color-template.model';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { MeasurementUnits } from 'src/app/core/enums/measurement-units';
import { ProjectStatus } from 'src/app/core/enums/project-status';
import { ReportTypes } from 'src/app/core/enums/report-types';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { User } from 'src/app/users/models/user.model';
import { UserService } from 'src/app/users/services/user.service';
import { TeamMembersComponent } from '../dialog-forms/team-members/team-members.component';
import { Project } from '../project.model';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    model = new Project();
    projectId : string;    
    
    // Lists for display in the UI
    clients = new Observable<Client[]>();
    locations = new BehaviorSubject(new Observable<Location[]>());
    equipments = new BehaviorSubject(new Observable<Equipment[]>());
    colorDescriptionTemplates = new Observable<ColorTemplate[]>();
    users = new Observable<User[]>();
    
    // Key/values holding object id and true/false indicating if has been selected
    usersSet = new Map();
    equipmentsSet = new Map();
    areaEquipmentsSet = new Map<string, Map<string, boolean>>();
    equipmentTemplateSet = new BehaviorSubject(of(new Map<string, ColorTemplate>()));

    // Lists of selected objects to assign to model
    selectedUsers : User[] = [];
    selectedEquipments : Equipment[] = [];  
    
    // Arrays for searching
    usersFromObservable : User[] = [];
    equipmentsFromObservable : Equipment[] = [];    
    templatesFromObservable : ColorTemplate[] = [];
    
    projectDetailsForm: FormGroup;
    projectEquipmentForm: FormGroup;
    colorDescriptiontForm: FormGroup;
    measurementUnitKeys = [];
    reportTypeKeys = [];
    measurementUnits = MeasurementUnits;
    reportTypes = ReportTypes;
    projectStatus = ProjectStatus;
    projectStatusKeys = [];

    constructor(        
        private projectsService: ProjectsService,
        private userService: UserService,
        private locationService: LocationService,
        private equipmentService: EquipmentService,
        private areaService: AreaService,
        private clientService: ClientService,
        private configurationService: ConfigurationService,
        private formBuilder: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private snackBar: MatSnackBar,
        public dialog: MatDialog) {                         
            super();
            this.model = new Project();
            this.measurementUnitKeys = Object.keys(this.measurementUnits).filter(unit => !isNaN(Number(unit))).map(Number);
            this.reportTypeKeys = Object.keys(this.reportTypes).filter(unit => !isNaN(Number(unit))).map(Number);
            this.projectStatusKeys = Object.keys(this.projectStatus).filter(status => !isNaN(Number(status))).map(Number);
            this.projectEquipmentForm = this.createEquipmentForm();
            this.colorDescriptiontForm = this.createColorDescriptionForm();
    }

    ngOnInit(): void {        
        this.clients = this.clientService.getAll();
        this.users = this.userService.getAll();
        this.colorDescriptionTemplates = this.configurationService.getColorTemplates();
        
        // Sets all Users to a key/value list as unselected (false)
        this.subs.sink = this.users.subscribe(
            users => {
                this.usersFromObservable = Array.from(users);
                users.forEach(user => {
                    this.usersSet.set(user.userId, false);       
                });
            }
        );

        this.subs.sink = this.colorDescriptionTemplates.subscribe(
            templates => {
                this.templatesFromObservable = Array.from(templates);
                if(this.model.projectId){
                     this.model.projectEquipments.forEach(equipment=>{
                        const projectColorTemplate = this.model.projectColorTemplates.find(colorTemplate => colorTemplate.projectEquipmentId === equipment.projectEquipmentId);
                        if(projectColorTemplate){
                            this.setEquipmentTemplate(projectColorTemplate.colorTemplateId, equipment.equipmentId);
                        }                        
                    });
                }
            }
        );

        this.activatedRoute.paramMap.subscribe((parameters : ParamMap)=> {
            if(parameters.has('id')) {                   
                this.projectId = parameters.get('id');
                this.subs.sink = this.projectsService.get(this.projectId).pipe(shareReplay())			
                .subscribe(
                    (project) => {
                        this.model = project;
                        this.loadLocationsByClient(project.clientId);
                        this.changeLocation(project.locationId);
                        this.selectedUsers = Array.from(project.users);
                        project.users.forEach(user => {
                            this.usersSet.set(user.userId, true);       
                        });
                    },
                    (error: HttpErrorResponse) => { this.showErrorNotification(); }
                );            
            }        
        });
    }

    createEquipmentForm(): FormGroup {
        return this.formBuilder.group({});
    }

    createColorDescriptionForm(): FormGroup {
        return this.formBuilder.group({});
    }

    clientChange(event: MatSelectChange) {                
        this.loadLocationsByClient(event.value);
    }

    loadLocationsByClient(clientId: string){
        const allLocations = this.locationService.getAllByClientId(clientId).pipe(shareReplay());
        this.subs.sink = allLocations.subscribe(
            locations => {
                locations.forEach(location => {
                  // Equipments Data
                  location.equipments = new BehaviorSubject(this.equipmentService.getByLocationId(location.locationId).pipe(shareReplay()));
                  this.subs.sink = location.equipments.value.subscribe(
                      equipments => {
                          equipments.forEach(equipment => {
                            // Areas Data
                            equipment.areas = new BehaviorSubject(this.areaService.getByEquipmentId(equipment.equipmentId).pipe(shareReplay()));
                          });
                      }
                  );
                });                
            }
        );
        this.locations.next(allLocations);
    }

    locationChange(event: MatSelectChange){
        this.changeLocation(event.value);
    }

    changeLocation(locationId: string){
        this.subs.sink = this.locations.value.subscribe(locations => {                                           
            const selectedLocation = locations.filter(location => location.locationId === locationId);
            
            this.subs.sink = selectedLocation[0].equipments.value.subscribe(
                equipments => {                               
                    this.equipments.next(of([]));
                    this.equipmentsFromObservable = Array.from(equipments);
                    this.equipmentsSet = new Map();
                    this.areaEquipmentsSet = new Map<string, Map<string, boolean>>(); 
                    let savedAreaIds = [];
                    let equipmentsWithoutAreas = [];
                    
                    equipments.forEach(equipment => {
                        //Check if Project is being edited so equipments selected should be set
                        if(this.model.projectId) {
                            // Set Selected Equipments based on model
                            const projectEquipments = this.model.projectEquipments.filter(projectEquipment => projectEquipment.equipmentId === equipment.equipmentId);
                            
                            if(projectEquipments.length > 0){
                                this.equipmentsSet.set(equipment.equipmentId, true);
                                // Get Areas to be set
                                const projectEquipmentIds = projectEquipments.map(projectEquipment => projectEquipment.projectEquipmentId);
                                const includedAreaIds = this.model.projectAreas.filter(projectArea => projectEquipmentIds.includes(projectArea.projectEquipmentId)).map(area => area.areaId);
                                savedAreaIds.push(...includedAreaIds);
                            }else{
                                this.equipmentsSet.set(equipment.equipmentId, false);
                            }
                        } else {
                            this.equipmentsSet.set(equipment.equipmentId, false);
                        }                        
                        
                        const areaSet = new Map();
                        this.subs.sink = equipment.areas.value.subscribe(areas => {

                            areas.forEach(area => {
                                if(this.model.projectId && savedAreaIds.length > 0 && savedAreaIds.includes(area.areaId)){
                                    areaSet.set(
                                        area.areaId,
                                        true);
                                }else {
                                    areaSet.set(
                                        area.areaId,
                                        false);
                                }
                                
                            });   
                            
                            if(areas.length > 0) {
                                this.areaEquipmentsSet.set(
                                    equipment.equipmentId, 
                                    areaSet
                                );
                            } else {
                                equipmentsWithoutAreas.push(equipment.equipmentId);
                            }

                            const equipmentsWithAreas = equipments.filter( eq => !equipmentsWithoutAreas.includes(eq.equipmentId));                            
                            this.equipments.next(of(equipmentsWithAreas));     
                        });
                    });                    
                }
            )
        });
    }

    areaIsSelected(areaId: string, equipmentId: string){
       return this.areaEquipmentsSet.get(equipmentId).get(areaId);
    } 

    addTeamMembers() {    
        const dialogRef = this.dialog.open(TeamMembersComponent, {
          data: {
              action: 'add',
              usersSet: this.usersSet,
              users: this.users
          },
          direction: 'ltr'
        });
  
        this.subs.sink = dialogRef.afterClosed().subscribe((usersSet) => {                      
          if (usersSet) {    
              this.usersSet = new Map(usersSet); // Refreshes the complete key/value list holding which User is added or removed
              this.selectedUsers = []; // Reset display list
              this.usersSet.forEach((value, key) => {
                  if(value){
                    const user = this.usersFromObservable.find(user => user.userId === key);
                    this.selectedUsers.push(user);
                  }
              });
          }
        });
    }

    equipmentSelectionChange($event: any, equipmentId: string, list: MatSelectionList) {        
        this.equipmentsSet.set(
            equipmentId,
            !this.equipmentsSet.get(equipmentId)
        );            
        
        if(!$event.checked){
            // Equipment unselected so we clear all Area checkboxes for the Equipment (and set in memory list to false)
            const mapEquimentArea = this.areaEquipmentsSet.get(equipmentId);            
            mapEquimentArea.forEach((value, key, map) => { map.set(key, false) });
            this.areaEquipmentsSet.set(equipmentId, mapEquimentArea);            
            list.selectedOptions.clear();         
            
            // Clear Map Equipment/Template so Parameters are removed from the list in the UI            
            this.subs.sink = this.equipmentTemplateSet.value.subscribe(mapEquipmentTemplate => {                
                mapEquipmentTemplate.set(equipmentId, null);
                this.equipmentTemplateSet.next(of(mapEquipmentTemplate));            
            });

            // If 3rd step Form Group already had a control with ID = equipmentId then we need to remove it from the Form Controls
            if(this.colorDescriptiontForm && this.colorDescriptiontForm.contains(equipmentId)) {
                this.colorDescriptiontForm.removeControl(equipmentId);
            }
        }
    }

    areaSelectionChange($event: any, equipmentId: string) {
        const mapEquimentArea = this.areaEquipmentsSet.get(equipmentId);
        mapEquimentArea.set(
            $event.option.value,
            !mapEquimentArea.get($event.option.value)
        )
    }

    templateChange(event: MatSelectChange, equipmentId: string) {
        this.setEquipmentTemplate(event.value, equipmentId);
    }

    setEquipmentTemplate(colorTemplateId: string, equipmentId: string){
        const template = this.templatesFromObservable.filter(template => template.colorTemplateId === colorTemplateId);
        this.subs.sink = this.equipmentTemplateSet.value.subscribe(mapEquipmentTemplate => {
            mapEquipmentTemplate.set(equipmentId, template[0]);
            this.equipmentTemplateSet.next(of(mapEquipmentTemplate));            
        });        
    }

    stepSelectionChange(event: StepperSelectionEvent) {
        if (event.selectedIndex === 2) { // Color Descriptions
            // Reset Equipment list
            this.selectedEquipments = [];

            if(!this.colorDescriptiontForm) {
                // 3rd Step Form Group created only if it was not created before (as we can move back and forth from step 2 to 3)
                this.colorDescriptiontForm = this.createColorDescriptionForm();                                
            }
             
            this.equipmentsSet.forEach((value, key) => {                
                if(value){                   
                    const selectedEquipment = this.equipmentsFromObservable.find(equipment => equipment.equipmentId === key);
                    this.selectedEquipments.push(selectedEquipment);
                    
                    let controlValue = null;
                    // Get value for control if New or Edit
                    if(this.model.projectId){
                        const projectEquipment = this.model.projectEquipments.find(equipment => equipment.equipmentId === key);
                        if(projectEquipment){
                            const projectColorTemplate = this.model.projectColorTemplates.find(colorTemplate => colorTemplate.projectEquipmentId === projectEquipment.projectEquipmentId);
                            if(projectColorTemplate) {
                                controlValue = projectColorTemplate.colorTemplateId;
                            }
                        }                        
                    }    
                    
                    // Add Form Control (Mat Select) for the given equipmentId
                    this.colorDescriptiontForm.addControl(key,new FormControl(controlValue, [Validators.required]));
                }
            });
        }
    }

    saveProject() {             
        // Team Members
        this.model.users = this.selectedUsers.map(user => user.userId);        
        
        // Equipment - Template
        this.subs.sink = this.equipmentTemplateSet.value.subscribe(mapEquipmentTemplate => {            
            this.model.equipmentTemplates = [];
            mapEquipmentTemplate.forEach((template, equipmentId) => {
                this.model.equipmentTemplates.push({equipmentId, colorTemplateId: template.colorTemplateId})                            
            });
        });  
        
        // Equipment - Area
        const equipmentAreas = [];
        this.areaEquipmentsSet.forEach((mapAreaSelection, equipmentId) => {
            mapAreaSelection.forEach((selected, areaId) => {
                if(selected) {
                    equipmentAreas.push({equipmentId, areaId});
                }
            });            
        });
        this.model.equipmentAreas = equipmentAreas;
        
        if(this.model.projectId) {
            this.subs.sink = this.projectsService.update(this.model).pipe(shareReplay())
            .subscribe(
                (project) => {
                    if(project){
                        this.showNotification(
                            'snackbar-success',
                            'Project successfully updated',
                            'bottom',
                            'center'
                        );
                        this.router.navigate(['projects/all']);
                    } else {
                        this.showErrorNotification();
                    }
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );
        } else {
            this.subs.sink = this.projectsService.add(this.model).pipe(shareReplay())
            .subscribe(
                (project) => {
                    if(project){
                        this.showNotification(
                            'snackbar-success',
                            'Project successfully added',
                            'bottom',
                            'center'
                        );
                        this.router.navigate(['projects/all']);
                    } else {
                        this.showErrorNotification();
                    }
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
