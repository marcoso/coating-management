import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { ApiService } from 'src/app/services/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ResetPassword } from '../models/reset-password';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
      private apiService : ApiService,
      private jwtHelper: JwtHelperService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.apiService
      .post<any>('auth/token', {
        username,
        password
      })
      .pipe(
        map((tokenResponse) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes            
          localStorage.setItem('currentUser', JSON.stringify(tokenResponse));
          this.currentUserSubject.next(tokenResponse);
          return tokenResponse;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return of({ success: false });
  }

  public currentUserForDisplay(): User {
    const tokenPayload = this.getTokenDecoded();
    return new User(tokenPayload.fullname, tokenPayload.role);
  }

  private getTokenDecoded() : any {    
    return this.jwtHelper.decodeToken(this.currentUserValue.token);
  }

  getTokenExpirationDate() {
    return this.jwtHelper.getTokenExpirationDate(this.currentUserValue.token);
  }
  
  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired(this.currentUserValue.token);
  }

  isAuthorizedForRole(roles: any[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    return roles.indexOf(userRole) >= 0;
  }

  public getUserRole(): string {
    const tokenPayload = this.getTokenDecoded();
    return tokenPayload.role;
  }

  sendRecoverPasswordEmail(email: string) : any {
    return this.apiService.post<any>('auth/recover', email);
  }

  resetPassword(data: ResetPassword) : any {
    return this.apiService.post<ResetPassword>('auth/reset', data);
  }

  getUserFromKey(key: string) : any {
    return this.apiService.post<any>('auth/key', key);
  }
}
