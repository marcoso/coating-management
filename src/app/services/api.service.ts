import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;
  private defaultHeaders: HttpHeaders;
  private fileHeaders: HttpHeaders;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    this.defaultHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.fileHeaders = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
  }

  getUrl(prefix: string){
    if(this.apiUrl != ''){
      return `${this.apiUrl}/${prefix}`;
    }else{
      return `${prefix}`;
    }
  }

  get<T>(prefix: string): Observable<T> {
    return this.http.get<T>(this.getUrl(prefix));
  }

  getFile(prefix: string): Observable<string> {
    return this.http.get(this.getUrl(prefix), { headers: this.fileHeaders, responseType : 'text'});
  }

  post<T>(prefix: string, objectToPost: any): Observable<T> {
    return this.http.post<T>(this.getUrl(prefix), JSON.stringify(objectToPost), { headers: this.defaultHeaders });
  }

  postFile<T>(prefix: string, objectToPost: any): Observable<T> {
    return this.http.post<T>(this.getUrl(prefix), objectToPost);
  }

  put<T>(prefix: string, objectToPost: any): Observable<T> {
    return this.http.put<T>(this.getUrl(prefix), JSON.stringify(objectToPost), { headers: this.defaultHeaders });
  }

  delete<T>(prefix: string, id: string): Observable<T> {
    return this.http.delete<T>(this.getUrl(prefix) + `/${id}`);
  }
}
