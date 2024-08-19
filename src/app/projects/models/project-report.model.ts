import { ProjectReportType } from "src/app/core/enums/project-report-type";

export class ProjectReport {
    projectReportId: string;
    projectId: string;
    projectName: string;  
    projectEquipmentId: string;
    filename: string;
    rawReportFile: string;
    createdBy: string;    
    createdByName: string;
    createdByLastName: string;
    createdAt: string;
    updatedAt: string;
    source: ProjectReportType;
    
    constructor(){ }
}
