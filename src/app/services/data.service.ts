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

  
  getEmployees(): Observable<Employee[] | HttpErrorResponse> {  
    // Comment-in the below two lines to simulate HttpErrorResponse
    // const error = new HttpErrorResponse({ error: 'bar', status: 403 });
    // return of(error);
  
    return this.httpClient.get<Employee[]>("/api/v2/employees");
  }

  getDepartments(): Observable<string[] | HttpErrorResponse> {
    return this.httpClient.get<string[]>("/api/v2/departments");
  }

  setCurrentNumberOfPages(currentCount: number, pageSize: number): number {
    return Math.ceil(currentCount / pageSize);
  }

//   setStringOutput(currentNumberOfPages: number): string {
//     let stringOutput = '1';
//     if (currentNumberOfPages === 1) return stringOutput;

//     for (let i = 2; i <= currentNumberOfPages; i++) {
//       stringOutput += i.toString();
//     }

//     return stringOutput;
//   }

  // Zero-ing out these values to demonstrate missing info in the UI per mockup
  zeroOutEmployeeDataForDemoPurposes(employee: Employee) {
    employee.avatar = "bad/url";
    employee.firstName = "";
    employee.position = "";
    employee.department = "";
  }

  addDepartmentValues(departments: string[]): DepartmentOption[] {
    let departmentArray : DepartmentOption[] = [];
    departments.forEach(department => {
      const departmentOption: DepartmentOption = {value: department, viewValue: department};
      departmentArray.push(departmentOption);
    });

    return departmentArray;
  }

  hasHttpErrorResponse(val: any): boolean {
    if ((val.employees.status && val.employees.status !== 200) || 
        (val.departments.status && val.departments.status !== 200)) {
      return true;
    }
    return false;
  }

}