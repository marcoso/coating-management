import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, map, merge, Observable } from "rxjs";
import { ProjectReport } from "../models/project-report.model";
import { ProjectReportTypePipe } from "../pipes/project-report-type.pipe";
import { ProjectsService } from "../projects.service";

export class ReportsDataSource extends DataSource<ProjectReport> {
	filterChange = new BehaviorSubject('');
    filteredData: ProjectReport[] = [];
	renderedData: ProjectReport[] = [];		

	constructor(
	  public projectsService: ProjectsService,
	  public paginator: MatPaginator,
	  public _sort: MatSort,
	  private projectReportTypePipe: ProjectReportTypePipe
	) {
	  super();
	  // Reset to the first page when the user changes the filter.
	  this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
	}

    get filter(): string {
        return this.filterChange.value;
    }

    set filter(filter: string) {
        this.filterChange.next(filter);
    }

	//Connect function called by the table to retrieve one stream containing the data to render.
	connect(): Observable<ProjectReport[]> {
	  // Listen for any changes in the base data, sorting, filtering, or pagination
	  const displayDataChanges = [
		this.projectsService.projectReportsDataSubject,
		this._sort.sortChange,
		this.filterChange,
		this.paginator.page
	  ];
	  this.projectsService.getCompletedReports();
      
	  return merge(...displayDataChanges).pipe(
		map(() => {
		  //Filter data
		  this.filteredData = this.projectsService.projectReportsData
			.slice()
			.filter((report: ProjectReport) => {
			  const searchStr = (
				report.projectName +
				report.filename +
				report.createdAt +
				report.createdByName + 
				report.createdByLastName +
				this.projectReportTypePipe.transform(report.source)
			  ).toLowerCase();
			  return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
			});
		  // Sort filtered data
		  const sortedData = this.sortData(this.filteredData.slice());
		  // Grab the page's slice of the filtered sorted data.
		  const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
		  this.renderedData = sortedData.splice(
			startIndex,
			this.paginator.pageSize
		  );
		  return this.renderedData;
		})
	  );
	}

	disconnect() {}
    
	/** Returns a sorted copy of the database data. */
	sortData(data: ProjectReport[]): ProjectReport[] {
	  if (!this._sort.active || this._sort.direction === '') {
		return data;
	  }
	  return data.sort((a, b) => {
		let propertyA: number | any;
		let propertyB: number | any;
		switch (this._sort.active) {
          case 'projectReportId':
			[propertyA, propertyB] = [a.projectReportId, b.projectReportId];
			break;
		  case 'projectName':
			[propertyA, propertyB] = [a.projectName, b.projectName];
			break;		  
          case 'filename':
			[propertyA, propertyB] = [a.filename, b.filename];
			break;
          case 'createdAt':
			[propertyA, propertyB] = [a.createdAt, b.createdAt];
			break;
		  case 'reportCreator':
			[propertyA, propertyB] = [a.createdByLastName + ', ' + a.createdByName, b.createdByLastName + ', ' + b.createdByName];
			break;
		  case 'source':
			[propertyA, propertyB] = [a.source, b.source];         
		}
		const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
		const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
		return (
		  (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
		);
	  });
	}
  }