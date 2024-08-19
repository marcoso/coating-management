import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClientService } from './services/client.service';
import { NewClientComponent } from './new-client/new-client.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { LocationService } from './services/location.service';
import { EquipmentService } from './services/equipment.service';
import { AreaService } from './services/area.service';
import { ElevationUnitsPipe } from './pipes/elevation-units.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { LocationComponent } from './dialog-forms/location/location.component';
import { EquipmentComponent } from './dialog-forms/equipment/equipment.component';
import { EquipmentTypesPipe } from './pipes/equipment-types.pipe';
import { BoilerSubTypesPipe } from './pipes/boiler-sub-types.pipe';
import { VesselSubTypesPipe } from './pipes/vessel-sub-types.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AreaComponent } from './dialog-forms/area/area.component';
import { MatDividerModule } from '@angular/material/divider';
import { ConfigurationModule } from '../configuration/configuration.module';

@NgModule({
  declarations: [
    ClientsComponent,
    NewClientComponent,
    ClientDetailsComponent,
    ElevationUnitsPipe,
    EquipmentTypesPipe,
    BoilerSubTypesPipe,
    VesselSubTypesPipe,
    LocationComponent,
    EquipmentComponent,
    AreaComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ClientsRoutingModule,
    MatTableModule,
	MatSortModule,
	MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDatepickerModule,
    MatDividerModule,
    ConfigurationModule
  ],
  providers: [
      ClientService,
      LocationService,
      EquipmentService,
      AreaService
  ],
  exports: [
    ElevationUnitsPipe,
    EquipmentTypesPipe,
    BoilerSubTypesPipe,
    VesselSubTypesPipe
  ]
})
export class ClientsModule { 


}
