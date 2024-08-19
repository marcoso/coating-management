import { SubArea } from "src/app/clients/models/sub-area.model";

export class MeasurementConfiguration {
    projectEquipmentId: string;
    subAreas: SubArea[];
    projectAreaFileSet: Map<string, File>;
    projectAreaOriginalFileNameSet: Map<string, string>;

    constructor(){
        this.projectAreaFileSet = new Map<string, File>();
        this.projectAreaOriginalFileNameSet = new Map<string, string>();
    }
}