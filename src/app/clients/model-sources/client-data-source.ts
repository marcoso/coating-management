import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, map, merge, Observable } from "rxjs";
import { Client } from "../models/client.model";
import { ClientService } from "../services/client.service";

export class ClientDataSource extends DataSource<Client> {
	filterChange = new BehaviorSubject('');
    filteredData: Client[] = [];
	renderedData: Client[] = [];		

	constructor(
	  public clientService: ClientService,
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
	connect(): Observable<Client[]> {
	  // Listen for any changes in the base data, sorting, filtering, or pagination
	  const displayDataChanges = [
		this.clientService.clientsDataSubject,
		this._sort.sortChange,
		this.filterChange,
		this.paginator.page
	  ];
      
	  this.clientService.setAll();
      
	  return merge(...displayDataChanges).pipe(
		map(() => {
		  // Filter data
		  this.filteredData = this.clientService.clientsData
			.slice()
			.filter((project: Client) => {
			  const searchStr = (
				project.name +				
				project.totalLocations +
				project.totalProjects +				
                project.isActive
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
	sortData(data: Client[]): Client[] {
	  if (!this._sort.active || this._sort.direction === '') {
		return data;
	  }
	  return data.sort((a, b) => {
		let propertyA: number | any;
		let propertyB: number | any;
		switch (this._sort.active) {
		  case 'clientId':
			[propertyA, propertyB] = [a.clientId, b.clientId];
			break;		  		  
          case 'name':
			[propertyA, propertyB] = [a.name, b.name];
			break;
		  case 'totalLocations':
			[propertyA, propertyB] = [a.totalLocations, b.totalLocations];
			break;
		  case 'totalProjects':
			[propertyA, propertyB] = [a.totalProjects, b.totalProjects];
			break;
          case 'isActive':
			[propertyA, propertyB] = [a.isActive, b.isActive];
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