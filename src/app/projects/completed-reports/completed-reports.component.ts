import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { AddReportComponent } from '../dialog-forms/add-report/add-report.component';
import { ReportsDataSource } from '../model-sources/reports-data-source';
import { ReportFile } from '../models/report-file.model';
import { ProjectReportTypePipe } from '../pipes/project-report-type.pipe';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-completed-reports',
  templateUrl: './completed-reports.component.html',
  styleUrls: ['./completed-reports.component.scss']
})
export class CompletedReportsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns: string[] = ['projectName', 'filename', 'createdAt', 'reportCreator', 'source', 'detail'];
  dataSource : ReportsDataSource | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  constructor(
      public projectService: ProjectsService,
      private router: Router,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private projectReportTypePipe: ProjectReportTypePipe) { 
    super();    
  }

  ngOnInit(): void {
      this.loadData();
  }

  public loadData() {
    this.dataSource = new ReportsDataSource(
      this.projectService,
      this.paginator,
      this.sort,
      this.projectReportTypePipe
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  addReport() {
    const dialogRef = this.dialog.open(AddReportComponent, {
      data: { 
          action: 'add'
      },
      direction: 'ltr',
      disableClose: true
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((reportFileModel: ReportFile) => {
      if(reportFileModel){
        this.subs.sink = this.projectService.importReport(reportFileModel)
            .subscribe(
                (projectReportId: string) => {
                    if(projectReportId){
                      this.loadData();
                      this.showNotification(
                        'snackbar-success',
                        'Report file successfully imported',
                        'bottom',
                        'center'
                      );
                    }
                },
                (error: HttpErrorResponse) => {
                    if(error.message) {
                        this.showErrorNotification(error.message); 
                    } else {
                        this.showErrorNotification(); 
                    }                    
                }
        ); 
      }           
    });
  }

  downloadReport(projectReportId: string, filename: string){    
    this.subs.sink = this.projectService.getReportBase64(projectReportId).subscribe(
      reportBase64 => {
          const byteCharacters = atob(reportBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);          
          const blob = new Blob([byteArray], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(objectUrl);            
      });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  showErrorNotification(message? : string) {
    this.showNotification(
        'snackbar-danger',
        message ? message : 'An error occurred, please try again.',
        'bottom',
        'center'
      );
  }
}  