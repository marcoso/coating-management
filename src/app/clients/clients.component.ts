import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';

import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import Swal from 'sweetalert2';
import { ClientDataSource } from './model-sources/client-data-source';
import { ClientService } from './services/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent  extends UnsubscribeOnDestroyAdapter implements OnInit {
    displayedColumns: string[] = ['name', 'totalLocations', 'totalProjects', 'isActive', 'detail'];
    dataSource : ClientDataSource | null;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;
    
    constructor(
        public clientService: ClientService, 
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar) { 
      super();    
    }
  
    ngOnInit(): void {
        this.loadData();
    }
  
    public loadData() {
      this.dataSource = new ClientDataSource(
        this.clientService,
        this.paginator,
        this.sort
      );
      this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup')
        .subscribe(() => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
    }

    newClient() {
        this.router.navigate(['/clients/client']);
    }

    deleteClient(clientId : string) {        
        if(clientId) {       
            Swal.fire({                
                text: "Are you sure you want to remove the client?",                
                showCancelButton: true,
                confirmButtonColor: '#EF473A',
                cancelButtonColor: '#0198F1',
                confirmButtonText: 'Remove'
              }).then((result) => {
                if (result.isConfirmed) {                    
                    this.clientService.delete(clientId)			
                    .subscribe(
                        (client) => {                    
                            const clients = this.clientService.clientsData;
                            const clientsFiltered = clients.filter(client => client.clientId !== clientId);
                            this.clientService.clientsDataSubject.next(clientsFiltered);   
                            
                            this.showNotification(
                                'snackbar-success',
                                'Client successfully removed',
                                'bottom',
                                'center'
                            );
                        },
                        (error: HttpErrorResponse) => { this.showErrorNotification(); }
                    );                  
                }
            });                        
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
  