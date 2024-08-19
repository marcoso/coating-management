import { BehaviorSubject, Observable } from "rxjs";
import { Equipment } from "./equipment.model";

export class Location {
    locationId: string;
    clientId: string;    
    name: string;    
    createdAt: string;
    updatedAt: string; 
    equipments: BehaviorSubject<Observable<Equipment[]>>;
    mainContact: string;

    constructor() {}    
}


