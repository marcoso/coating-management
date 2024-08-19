import { ElevationUnits } from "src/app/core/enums/elevation-units";

export class Area {
    areaId : string;
    name: string;
    equipmentId: string;
    elevationUnit: ElevationUnits;
    elevationIncrement: number;
    tubeDiameter: number;
    readings: number;
    tubesStart: number;
    tubesEnd: number;    
    referenceTube: number;
    referenceElevation: number;
    referenceX: string;
    referenceY: string;
    createdAt: string;
    updatedAt: string;

    constructor() {}

}