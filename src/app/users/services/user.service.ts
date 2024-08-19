import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends UnsubscribeOnDestroyAdapter {
    usersDataSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);    
    isUsersDataLoading = true;
    
    constructor(private apiService : ApiService) {
        super();
    }

    get usersData(): User[] {
        return this.usersDataSubject.value;
    }    

    get(userId: string) : Observable<User> {
        return this.apiService.get<User>(`users/${userId}`);        
    }

    getAll() : Observable<User[]> {
        return this.apiService.get<User[]>('users');
    }

  	setAll() : void {		
        this.subs.sink = this.apiService.get<User[]>('users')
        .subscribe(
          (data) => {
            this.isUsersDataLoading = false;
            this.usersDataSubject.next(data);
          },
          (error: HttpErrorResponse) => {
            this.isUsersDataLoading = false;
            console.log(error.name + ' ' + error.message);
          }
        );
	}

    add(user: User) : Observable<User> {
        return this.apiService.post<User>('users', user);        
    }

    update(user: User) : Observable<User> {
        return this.apiService.put<User>('users', user);        
    }

    delete(userId: string) : Observable<User> {
        return this.apiService.delete<User>('users/', userId);        
    }
}