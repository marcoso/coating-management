import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService  extends UnsubscribeOnDestroyAdapter {
    clientsDataSubject: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>([]);    
    isClientsDataLoading = true;
    
    constructor(private apiService : ApiService) {
        super();
    }

    get clientsData(): Client[] {
        return this.clientsDataSubject.value;
    }    

    get(clientId: string) : Observable<Client> {
        return this.apiService.get<Client>('clients/' + clientId);        
    }

    getAll() : Observable<Client[]> {
        return this.apiService.get<Client[]>('clients');
    }

  	setAll() : void {		
        this.subs.sink = this.apiService.get<Client[]>('clients')
        .subscribe(
          (data) => {
            this.isClientsDataLoading = false;
            this.clientsDataSubject.next(data);
          },
          (error: HttpErrorResponse) => {
            this.isClientsDataLoading = false;
            console.log(error.name + ' ' + error.message);
          }
        );
	}

    add(client: Client) : Observable<Client> {
        return this.apiService.post<Client>('clients', client);        
    }

    update(client: Client) : Observable<Client> {
        return this.apiService.put<Client>('clients', client);        
    }

    delete(clientId: string) : Observable<Client> {
        return this.apiService.delete<Client>('clients', clientId);        
    }
}
