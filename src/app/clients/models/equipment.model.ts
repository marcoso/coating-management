import { BehaviorSubject, Observable } from "rxjs";
import { Area } from "./area.model";

export class Equipment {
    equipmentId: string;    
    locationId: string;    
    name: string;    
    createdAt: string;
    updatedAt: string; 
    type: number;
    subType: number;
    subTypeName: string;
    equipmentDate: string;
    scopeDescription: string;
    areas: BehaviorSubject<Observable<Area[]>>;

    constructor() {
        this.equipmentDate = new Date().toISOString();
        this.subTypeName = '';
    }  
}