import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { BehaviorSubject, map, Observable, of, shareReplay } from 'rxjs';
import { EquipmentColorTemplate } from 'src/app/projects/models/equipment-color-template.model';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import Swal from 'sweetalert2';
import { AreaComponent } from '../dialog-forms/area/area.component';
import { EquipmentComponent } from '../dialog-forms/equipment/equipment.component';
import { LocationComponent } from '../dialog-forms/location/location.component';
import { Area } from '../models/area.model';

import { Client } from '../models/client.model';
import { Equipment } from '../models/equipment.model';
import { Location } from '../models/location.model';
import { AreaService } from '../services/area.service';
import { ClientService } from '../services/client.service';
import { EquipmentService } from '../services/equipment.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    clientModel = new Client();
    locations = new BehaviorSubject(new Observable<Location[]>());
    clientId : string;

  constructor(
        private clientService: ClientService, 
        private locationService: LocationService,
        private equipmentService: EquipmentService,
        private areaService: AreaService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private snackBar: MatSnackBar) { 
            super();
        }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((parameters : ParamMap)=> {
      if(parameters.has('id')) {                   
          this.clientId = parameters.get('id');

          // Client Data
          this.subs.sink = this.clientService.get(this.clientId)			
          .subscribe(
              (client) => { this.clientModel = client },
              (error: HttpErrorResponse) => { this.showErrorNotification(); }
          ); 

          // Locations Data
          const allLocations = this.locationService.getAllByClientId(this.clientId).pipe(shareReplay());
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
    });
  }

  editClient() {
      if(this.clientId) {
        this.router.navigate(['/clients/client', this.clientId]);
      }
  }

  addNewLocation() {    
      const dialogRef = this.dialog.open(LocationComponent, {
        data: {
            action: 'add'
        },
        direction: 'ltr'
      });

      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {          
        if (result) {
            this.subs.sink = this.locationService.add(result, this.clientId)
            .subscribe(
                (location) => {
                    this.subs.sink = this.locations.value.subscribe(locations => {
                        if(!location.equipments) {
                            // After saving the Location the list of Equipments does not come in the response so we need to initialize it
                            location.equipments = new BehaviorSubject(of([]));
                        }
                        locations.push(location);
                        this.locations.next(of(locations));
                    });
                    
                    this.showNotification(
                        'snackbar-success',
                        'Location successfully added',
                        'bottom',
                        'center'
                      );
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );             
        }
      });
  }

  editLocation(locationId: string) {    
    const dialogRef = this.dialog.open(LocationComponent, {
        data: {            
            locationId: locationId,
            clientId: this.clientId,
            action: 'edit'
        },
        direction: 'ltr'
      });

      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {          
        if (result) {            
            this.subs.sink = this.locationService.update(result, this.clientId)
            .subscribe(
                (updatedLocation) => {                    
                    this.subs.sink = this.locations.value.subscribe(locations => {                                           
                        const filteredLocations = locations.filter(location => location.locationId !== updatedLocation.locationId);
                        if(!updatedLocation.equipments) {
                            // After updating the Location the list of Equipments does not come in the response so we need to initialize it
                            updatedLocation.equipments = new BehaviorSubject(of([]));
                        }             
                        filteredLocations.push(updatedLocation);
                        this.locations.next(of(filteredLocations));
                    });
                    
                    this.showNotification(
                        'snackbar-success',
                        'Location successfully updated',
                        'bottom',
                        'center'
                      );
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );             
        }
      });
  }

  deleteLocation(locationId: string) {    
    Swal.fire({                
        text: "Are you sure you want to remove the Location?",                
        showCancelButton: true,
        confirmButtonColor: '#EF473A',
        cancelButtonColor: '#0198F1',
        confirmButtonText: 'Remove'
      }).then((result) => {
        if (result.isConfirmed) {                    
            this.subs.sink = this.locationService.delete(this.clientId, locationId)
            .subscribe(
                (result) => {             
                    this.showNotification(
                        'snackbar-success',
                        'Location successfully removed',
                        'bottom',
                        'center'
                    );

                    // After deleting the Location we update the list in memory by also removing the Location
                    const remainingLocations = this.locations.value.pipe(map(locations => locations.filter(location => location.locationId !== locationId)));                 
                    this.locations.next(remainingLocations);
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );                  
        }
    });        
  }

  addEquipment(locationId: string) {
    const dialogRef = this.dialog.open(EquipmentComponent, {
        data: {
            locationId: locationId,
            action: 'add'
        },
        direction: 'ltr'
      });

      this.subs.sink = dialogRef.afterClosed().subscribe((equipment: EquipmentColorTemplate) => {          
        if (equipment) {
            this.subs.sink = this.equipmentService.add(equipment.model, equipment.model.locationId)
            .subscribe(
                (newEquipment) => {
                    // Areas Data                                
                    newEquipment.areas = new BehaviorSubject(of([]));

                    //Reload of Equipment in a Location
                    this.subs.sink = this.locations.value.pipe(
                        map(locations => locations.filter(location => location.locationId === newEquipment.locationId)))
                        .subscribe(location => {
                            let equipmentsSubject = new BehaviorSubject<Observable<Equipment[]>>(of([]));
                            this.subs.sink = location[0].equipments.value.subscribe(
                                equipments => {
                                    equipments.push(newEquipment);
                                    equipmentsSubject.next(of(equipments));
                                });

                            location[0].equipments.next(equipmentsSubject.value);
                        });                 
                    
                    this.showNotification(
                        'snackbar-success',
                        'Equipment successfully added',
                        'bottom',
                        'center'
                      );
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );             
        }
      });
  }

  editEquipment(equipmentId: string, locationId: string) {    
    const dialogRef = this.dialog.open(EquipmentComponent, {
        data: {            
            equipmentId: equipmentId,
            locationId: locationId,            
            action: 'edit'
        },
        direction: 'ltr'
      });

      this.subs.sink = dialogRef.afterClosed().subscribe((equipment) => {          
        if (equipment) {            
            this.subs.sink = this.equipmentService.update(equipment.model, equipment.model.locationId)
            .subscribe(
                (updatedEquipment) => {      
                    if(!updatedEquipment.areas) {
                        updatedEquipment.areas = new BehaviorSubject(this.areaService.getByEquipmentId(equipment.equipmentId).pipe(shareReplay())); 
                    }
                    
                    //Reload of Equipment in a Location
                    this.subs.sink = 
                        this.locations.value.pipe(
                            map(locations => locations.filter(location => location.locationId === updatedEquipment.locationId))
                        )
                        .subscribe(location => {                                                                                    
                            let allEquipments = location[0].equipments.value.pipe(
                                map(equipments => {
                                    let equipmentsWithoutUpdated = equipments.filter(eq => eq.equipmentId !== updatedEquipment.equipmentId);
                                    equipmentsWithoutUpdated.push(updatedEquipment);
                                    return equipmentsWithoutUpdated;
                                })
                            );
                            location[0].equipments.next(allEquipments);                                
                        }); 
                    
                    this.showNotification(
                        'snackbar-success',
                        'Equipment successfully updated',
                        'bottom',
                        'center'
                      );
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );             
        }
      });
  }

  deleteEquipment(equipmentId: string, locationId: string) {  
    Swal.fire({                
        text: "Are you sure you want to remove the Equipment?",                
        showCancelButton: true,
        confirmButtonColor: '#EF473A',
        cancelButtonColor: '#0198F1',
        confirmButtonText: 'Remove'
      }).then((result) => {
        if (result.isConfirmed) {                    
            this.subs.sink = this.equipmentService.delete(locationId, equipmentId)
            .subscribe(
                (result) => {             
                    this.subs.sink = this.locations.value.pipe(
                        map(locations => locations.filter(location => location.locationId === locationId))
                    )
                    .subscribe(location => {                                                                                    
                        let allEquipments = location[0].equipments.value.pipe(
                            map(equipments => equipments.filter(eq => eq.equipmentId !== equipmentId))
                        );
                        location[0].equipments.next(allEquipments);                                
                    });        
                   
                    this.showNotification(
                        'snackbar-success',
                        'Equipment successfully removed',
                        'bottom',
                        'center'
                      );
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );                 
        }
    });  
  }

  addArea(equipmentId: string, equipmentType: number, locationId: string) {
    const dialogRef = this.dialog.open(AreaComponent, {
        data: {
            equipmentId: equipmentId,
            equipmentType: equipmentType,
            action: 'add'
        },
        direction: 'ltr'
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((area) => {          
    if (area) {
        this.subs.sink = this.areaService.add(area, area.equipmentId)
        .subscribe(
            (newArea) => {
                //Reload Equipment with the new Area
                this.subs.sink = this.locations.value.pipe(
                    map(locations => locations.filter(location => location.locationId === locationId)))
                    .subscribe(location => {
                        let areasSubject = new BehaviorSubject<Observable<Area[]>>(of([]));
                        this.subs.sink = location[0].equipments.value.pipe(
                            map(equipments => equipments.filter(equipment => equipment.equipmentId === area.equipmentId))
                        )                        
                        .subscribe(
                            equipments => {
                                equipments[0].areas.value.subscribe(
                                    areas => {
                                        areas.push(newArea);
                                        areasSubject.next(of(areas));
                                    }
                                );
                                equipments[0].areas.next(areasSubject.value);                                
                            });                        
                    });                 
                
                this.showNotification(
                    'snackbar-success',
                    'Area successfully added',
                    'bottom',
                    'center'
                    );
            },
            (error: HttpErrorResponse) => { this.showErrorNotification(); }
        );             
    }
    });
  }

  editArea(areaId:string, equipmentId: string, equipmentType: number,locationId: string) {      
    const dialogRef = this.dialog.open(AreaComponent, {
        data: {            
            areaId: areaId,
            equipmentId: equipmentId,
            equipmentType: equipmentType,                 
            action: 'edit'
        },
        direction: 'ltr'
      });

      this.subs.sink = dialogRef.afterClosed().subscribe((area) => {          
        if (area) {            
            this.subs.sink = this.areaService.update(area, area.equipmentId)
            .subscribe(
                (updatedArea) => {              
                    //Reload Equipment with the new Area
                    this.subs.sink = 
                        this.locations.value.pipe(
                            map(locations => locations.filter(location => location.locationId === locationId))
                        )
                        .subscribe(location => {                            
                            this.subs.sink = location[0].equipments.value.pipe(
                                map(equipments => equipments.filter(equipment => equipment.equipmentId === updatedArea.equipmentId))
                            )                        
                            .subscribe(equipments => {
                                const allAreas = equipments[0].areas.value.pipe(
                                    map(areas => {
                                        const areasWithoutUpdated = areas.filter(area => area.areaId !== updatedArea.areaId);
                                        areasWithoutUpdated.push(updatedArea);
                                        return areasWithoutUpdated;
                                    })
                                );
                                equipments[0].areas.next(allAreas);
                            });                        
                        });
                    
                    this.showNotification(
                        'snackbar-success',
                        'Area successfully updated',
                        'bottom',
                        'center'
                      );
                },
                (error: HttpErrorResponse) => { this.showErrorNotification(); }
            );             
        }
      });
  }

  deleteArea(areaId:string, equipmentId: string, locationId: string){
    Swal.fire({                
        text: "Are you sure you want to remove the Area?",                
        showCancelButton: true,
        confirmButtonColor: '#EF473A',
        cancelButtonColor: '#0198F1',
        confirmButtonText: 'Remove'
      }).then((result) => {
        if (result.isConfirmed) {                    
            this.subs.sink = this.areaService.delete(areaId, equipmentId)
            .subscribe(
                (result) => {             
                    this.subs.sink = this.locations.value.pipe(
                        map(locations => locations.filter(location => location.locationId === locationId))
                    )
                    .subscribe(location => {        
                        this.subs.sink = location[0].equipments.value.pipe(
                            map(equipments => equipments.filter(eq => eq.equipmentId === equipmentId))
                        )
                        .subscribe(equipment => {
                            const allAreasWithoutDeleted = equipment[0].areas.value.pipe(
                                map(areas => areas.filter(area => area.areaId !== areaId))
                            );
                            equipment[0].areas.next(allAreasWithoutDeleted);                                
                        });                
                    });        
                   
                    this.showNotification(
                        'snackbar-success',
                        'Area successfully removed',
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
