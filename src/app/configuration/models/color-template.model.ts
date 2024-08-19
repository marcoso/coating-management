import { BehaviorSubject, Observable, of } from "rxjs";
import { ColorTemplateParam } from "./color-template-param.model";

export class ColorTemplate {
    colorTemplateId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    parameters: ColorTemplateParam[] = [];
    parametersSubject: BehaviorSubject<Observable<ColorTemplateParam[]>> = new BehaviorSubject(of([]));

    constructor() {
    }
}