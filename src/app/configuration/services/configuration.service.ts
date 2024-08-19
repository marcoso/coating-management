import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ColorTemplateParam } from '../models/color-template-param.model';
import { ColorTemplate } from '../models/color-template.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

    constructor(private apiService: ApiService) { }

    // Templates
    getColorTemplates() : Observable<ColorTemplate[]> {
        return this.apiService.get<ColorTemplate[]>('configuration/templates');
    }

    getById(colorTemplateId: string) : Observable<ColorTemplate> {
        return this.apiService.get<ColorTemplate>(`configuration/templates/${colorTemplateId}`);
    }

    add(colorTemplate: ColorTemplate) : Observable<ColorTemplate> {
        return this.apiService.post<ColorTemplate>(`configuration/templates`, colorTemplate);        
    }

    update(colorTemplate: ColorTemplate) : Observable<ColorTemplate> {
        return this.apiService.put<ColorTemplate>(`configuration/templates`, colorTemplate);        
    }

    delete(colorTemplateId: string) : Observable<ColorTemplate> {
        return this.apiService.delete<ColorTemplate>(`configuration/templates`, colorTemplateId);        
    }

    // Parameters

    getColorTemplateParameters(colorTemplateId: string) : Observable<ColorTemplateParam[]> {
        return this.apiService.get<ColorTemplateParam[]>(`configuration/templates/${colorTemplateId}/parameter`);
    }

    getParamById(colorTemplateId: string, colorTemplateParamId: string) : Observable<ColorTemplateParam> {
        return this.apiService.get<ColorTemplateParam>(`configuration/templates/${colorTemplateId}/parameter/${colorTemplateParamId}`);
    }

    addParameter(colorTemplateParam: ColorTemplateParam) : Observable<ColorTemplateParam> {
        return this.apiService.post<ColorTemplateParam>(`configuration/templates/${colorTemplateParam.colorTemplateId}/parameter`, colorTemplateParam);
    }

    updateParameter(colorTemplateParam: ColorTemplateParam) : Observable<ColorTemplateParam> {
        return this.apiService.put<ColorTemplateParam>(`configuration/templates/${colorTemplateParam.colorTemplateId}/parameter`, colorTemplateParam);
    }

    deleteParameter(colorTemplateId: string, colorTemplateParamId: string) : Observable<ColorTemplateParam> {
        return this.apiService.delete<ColorTemplateParam>(`configuration/templates/${colorTemplateId}/parameter`, colorTemplateParamId);   
    }
}
