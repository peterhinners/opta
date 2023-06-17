import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, AsyncSubject, ReplaySubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

//   product$ = new BehaviorSubject<any>('no product yet');

  constructor(private httpClient: HttpClient) { }

  setProduct(product: any) {
    // this.product$.next(product);
  }

  doSomething() {
    return "something";
  }

  getEmployees(): Observable<any> {  
    // return this.httpClient.get("/api/v2/employees");

    // let error = new HttpErrorResponse({ error: 'bar', status: 403 });
    // return of(error);
    // return this.handleError(error);

    return this.httpClient.get("/api/v2/employees");
    
    
    // .pipe(
    //   catchError(this.handleError)
    // );


 
  }

  getDepartments(): Observable<any> {
    return this.httpClient.get("/api/v2/departments");


    // .pipe(
    //   catchError(this.handleError)
    // );
  }

}