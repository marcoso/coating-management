export class ColorTemplateParam {
    colorTemplateParamId: string;
    colorTemplateId: string;
    minValue: number;
    maxValue: number;
    reference: string;
    color: string;
    createdAt: string;
    updatedAt: string;

    constructor(){
        this.minValue = 0;
        this.maxValue = 0;
    }

}