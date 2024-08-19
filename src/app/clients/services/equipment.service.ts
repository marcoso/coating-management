import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EquipmentColorTemplate } from 'src/app/projects/models/equipment-color-template.model';
import { ProjectEquipmentColorTemplate } from 'src/app/projects/models/project-equipment-color-template.model';
import { ProjectEquipment } from 'src/app/projects/models/project-equipment.model';
import { ApiService } from 'src/app/services/api.service';
import { Equipment } from '../models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
    
    constructor(private apiService : ApiService) {
    }

    getByLocationId(locationId: string) : Observable<Equipment[]> {
        return this.apiService.get<Equipment[]>(`equipments/${locationId}`);        
    }

    getById(locationId: string, equipmentId: string) : Observable<Equipment> {
        return this.apiService.get<Equipment>(`equipments/${locationId}/${equipmentId}`);        
    }

    add(equipment: Equipment, locationId: string) : Observable<Equipment> {
        return this.apiService.post<Equipment>(`equipments/${locationId}`, equipment);        
    }

    addEquipmentToProject(equipment: EquipmentColorTemplate, projectId: string) : Observable<ProjectEquipmentColorTemplate> {
        return this.apiService.post<ProjectEquipmentColorTemplate>(`equipments/project/${projectId}/${equipment.colorTemplateId}`, equipment.model);        
    }

    update(equipment: Equipment, locationId: string) : Observable<Equipment> {
        return this.apiService.put<Equipment>(`equipments/${locationId}`, equipment);        
    }

    delete(locationId: string, equipmentId: string) : Observable<Equipment> {
        return this.apiService.delete<Equipment>(`equipments/${locationId}`, equipmentId);        
    }
}
