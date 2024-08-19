import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProjectArea } from 'src/app/projects/models/project-area.model';
import { ApiService } from 'src/app/services/api.service';
import { Area } from '../models/area.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

    constructor(private apiService : ApiService) {
    }

    getByEquipmentId(equipmentId: string) : Observable<Area[]> {
        return this.apiService.get<Area[]>(`areas/${equipmentId}`);        
    }

    getById(areaId: string, equipmentId: string) : Observable<Area> {
        return this.apiService.get<Area>(`areas/${equipmentId}/${areaId}`);        
    }

    add(area: Area, equipmentId: string) : Observable<Area> {
        return this.apiService.post<Area>(`areas/${equipmentId}`, area);        
    }

    addAreaToProject(area: Area, projectEquipmentId: string, projectId: string) : Observable<ProjectArea> {
        return this.apiService.post<ProjectArea>(`areas/project/${projectEquipmentId}/${projectId}`, area);        
    }

    update(area: Area, equipmentId: string) : Observable<Area> {
        return this.apiService.put<Area>(`areas/${equipmentId}`, area);        
    }

    delete(areaId: string, equipmentId: string) : Observable<Area> {
        return this.apiService.delete<Area>(`areas/${equipmentId}`, areaId);        
    }
}
