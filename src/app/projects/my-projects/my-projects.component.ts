import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { ProjectStatus } from 'src/app/core/enums/project-status';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MyProjectDataSource } from '../model-sources/my-projects-data-source';
import { ProjectsService } from '../projects.service';


@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns: string[] = ['client', 'name', 'location', 'startDate', 'endDate', 'updatedAt', 'projectCreator', 'status', 'detail'];
  dataSource : MyProjectDataSource | null;
  status = ProjectStatus;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  constructor(
      public projectService: ProjectsService,
      private router: Router) { 
    super();    
  }

  ngOnInit(): void {
      this.loadData();
  }

  public loadData() {
    this.dataSource = new MyProjectDataSource(
      this.projectService,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  newProject() {
    this.router.navigate(['/projects/project']);
  }

}
