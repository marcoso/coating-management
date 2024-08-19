import { ProjectColorTemplateParam } from "./project-color-template-param.model";
import { ProjectColorTemplate } from "./project-color-template.model";
import { ProjectEquipment } from "./project-equipment.model";

export class ProjectEquipmentColorTemplate
{
    projectEquipment: ProjectEquipment;
    projectColorTemplate: ProjectColorTemplate;
    projectColorTemplateParams: ProjectColorTemplateParam[];
}