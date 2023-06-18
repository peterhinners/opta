import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, AsyncSubject, ReplaySubject, Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Employee } from '../interfaces/employee';
import { DepartmentOption } from '../interfaces/department-option';

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

  getEmployees(): Observable<Employee[] | HttpErrorResponse> {  
    // return this.httpClient.get("/api/v2/employees");

    // let error = new HttpErrorResponse({ error: 'bar', status: 403 });
    // return of(error);
    // return this.handleError(error);

    return this.httpClient.get<Employee[]>("/api/v2/employees");
  }

  getDepartments(): Observable<string[] | HttpErrorResponse> {
    return this.httpClient.get<string[]>("/api/v2/departments");
  }

}