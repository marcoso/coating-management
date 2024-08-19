import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ColorDescriptionTemplatesComponent } from './color-description-templates/color-description-templates.component';
import { TemplateComponent } from './dialog-forms/template/template.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ParameterComponent } from './dialog-forms/parameter/parameter.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { RangePipe } from './pipes/range.pipe';
import { ConfigurationService } from './services/configuration.service';

@NgModule({
  declarations: [
    ColorDescriptionTemplatesComponent,
    TemplateComponent,
    ParameterComponent,
    RangePipe
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    ReactiveFormsModule,
    FormsModule,        
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    ColorPickerModule
  ],
  providers: [
      ConfigurationService
  ],
  exports: [
      RangePipe
  ]
})
export class ConfigurationModule { }
