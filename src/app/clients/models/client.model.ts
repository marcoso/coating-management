export class Client {
    clientId: string;    
    name: string;
    isActive: boolean = false;
    totalLocations: number;
    totalProjects: number;     
    createdAt: string;
    updatedAt: string; 
    specifiedAverageThickness: number;
    minorThicknessToleranceStart: number;
    minorThicknessToleranceEnd: number;
    majorThicknessToleranceStart: number;
    majorThicknessToleranceEnd: number;

    constructor() {}
}
