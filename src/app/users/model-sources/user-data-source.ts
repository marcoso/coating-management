import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, map, merge, Observable } from "rxjs";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

export class UserDataSource extends DataSource<User> {
	filterChange = new BehaviorSubject('');
    filteredData: User[] = [];
	renderedData: User[] = [];		

	constructor(
	  public userService: UserService,
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
	connect(): Observable<User[]> {
	  // Listen for any changes in the base data, sorting, filtering, or pagination
	  const displayDataChanges = [
		this.userService.usersDataSubject,
		this._sort.sortChange,
		this.filterChange,
		this.paginator.page
	  ];
      
	  this.userService.setAll();
      
	  return merge(...displayDataChanges).pipe(
		map(() => {
		  // Filter data
		  this.filteredData = this.userService.usersData
			.slice()
			.filter((user: User) => {
			  const searchStr = (
				user.username +				
				user.firstName +
				user.lastName +				
                user.role +
                user.isActive 
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
	sortData(data: User[]): User[] {
	  if (!this._sort.active || this._sort.direction === '') {
		return data;
	  }
	  return data.sort((a, b) => {
		let propertyA: number | any;
		let propertyB: number | any;
		switch (this._sort.active) {
		  case 'userId':
			[propertyA, propertyB] = [a.userId, b.userId];
			break;		  		  
          case 'username':
			[propertyA, propertyB] = [a.username, b.username];
			break;
		  case 'firstName':
			[propertyA, propertyB] = [a.firstName, b.firstName];
			break;
		  case 'lastName':
			[propertyA, propertyB] = [a.lastName, b.lastName];
			break;
          case 'role':
			[propertyA, propertyB] = [a.role, b.role];
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