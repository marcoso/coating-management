import { MeasurementUnits } from '../core/enums/measurement-units';
import { ProjectStatus } from '../core/enums/project-status';
import { ReportTypes } from '../core/enums/report-types';
import { ProjectArea } from './models/project-area.model';
import { ProjectColorTemplateParam } from './models/project-color-template-param.model';
import { ProjectColorTemplate } from './models/project-color-template.model';
import { ProjectEquipment } from './models/project-equipment.model';

export class Project {
    projectId: string;  
    clientId: string;
    client: string;
    name: string;
    locationId: string;
    location: string;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    measurementUnit: MeasurementUnits;
    reportType: ReportTypes;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    createdByName: string;
    createdByLastName: string;
    equipments: any[];
    users: any[];
    equipmentAreas: any[];
    equipmentTemplates: any[];
    projectEquipments: ProjectEquipment[];    
    projectAreas: ProjectArea[];
    projectColorTemplates: ProjectColorTemplate[];
    projectColorTemplateParams: ProjectColorTemplateParam[];

    constructor(){ }
}
