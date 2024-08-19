import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

    constructor(private apiService : ApiService) { }

    getByLocationId(locationId: string, clientId: string) : Observable<Location> {
        return this.apiService.get<Location>(`locations/${clientId}/${locationId}`);        
    }

    getAllByClientId(clientId: string) : Observable<Location[]> {
        return this.apiService.get<Location[]>(`locations/${clientId}`);       
    }

    add(location: Location, clientId: string) : Observable<Location> {
        return this.apiService.post<Location>(`locations/${clientId}`, location);        
    }

    update(location: Location, clientId: string) : Observable<Location> {
        return this.apiService.put<Location>(`locations/${clientId}`, location);        
    }

    delete(clientId: string, locationId: string) : Observable<Location> {
        return this.apiService.delete<Location>(`locations/${clientId}`, locationId);        
    }
}
