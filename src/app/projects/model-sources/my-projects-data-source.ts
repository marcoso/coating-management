import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, map, merge, Observable } from "rxjs";
import { Project } from "../project.model";
import { ProjectsService } from "../projects.service";

export class MyProjectDataSource extends DataSource<Project> {
	filterChange = new BehaviorSubject('');
    filteredData: Project[] = [];
	renderedData: Project[] = [];		

	constructor(
	  public projectsService: ProjectsService,
	  public paginator: MatPaginator,
	  public _sort: MatSort
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
	connect(): Observable<Project[]> {
	  // Listen for any changes in the base data, sorting, filtering, or pagination
	  const displayDataChanges = [
		this.projectsService.myProjectsDataSubject,
		this._sort.sortChange,
		this.filterChange,
		this.paginator.page
	  ];
	  this.projectsService.getMyProjects();
      
	  return merge(...displayDataChanges).pipe(
		map(() => {
		  // Filter data
		  this.filteredData = this.projectsService.myProjectsData
			.slice()
			.filter((project: Project) => {
			  const searchStr = (
				project.name +
				project.clientId +
				project.locationId +
				project.startDate +
				project.endDate +
				project.updatedAt + 
				project.createdByName + 
				project.createdByLastName + 
                project.status +
                project.measurementUnit
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
	sortData(data: Project[]): Project[] {
	  if (!this._sort.active || this._sort.direction === '') {
		return data;
	  }
	  return data.sort((a, b) => {
		let propertyA: number | any;
		let propertyB: number | any;
		switch (this._sort.active) {
		  case 'projectId':
			[propertyA, propertyB] = [a.projectId, b.projectId];
			break;		  
		  case 'client':
			[propertyA, propertyB] = [a.clientId, b.clientId];
			break;
          case 'name':
			[propertyA, propertyB] = [a.name, b.name];
			break;
		  case 'location':
			[propertyA, propertyB] = [a.locationId, b.locationId];
			break;
		  case 'startDate':
			[propertyA, propertyB] = [a.startDate, b.startDate];
			break;
          case 'endDate':
			[propertyA, propertyB] = [a.endDate, b.endDate];
			break;
		  case 'updatedAt':
			[propertyA, propertyB] = [a.updatedAt, b.updatedAt];
			break;
		  case 'projectCreator':
			[propertyA, propertyB] = [a.createdByLastName + ', ' + a.createdByName, b.createdByLastName + ', ' + b.createdByName];
			break;
		  case 'status':
			[propertyA, propertyB] = [a.status, b.status];
			break;
          case 'measurementUnit':
			[propertyA, propertyB] = [a.measurementUnit, b.measurementUnit];
			break;            
		}
		const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
		const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
		return (
		  (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
		);
	  });
	}
  }