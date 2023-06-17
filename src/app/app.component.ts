import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, forkJoin, of, tap, throwError } from 'rxjs';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'opta-app';
  employees: any = [];
  departments: any = [];
  error: boolean = false;

  constructor(private httpClient: HttpClient, private dataService: DataService) {}

  ngOnInit(): void {

    console.log("service? ", this.dataService.doSomething());
    this.getData();
  }

  getData(): void {
    // No need to unsubscribe, as forkJoin "Runs all observable sequences in parallel 
    // and collect their last elements"
    // See also: https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin
    forkJoin({
      employees: this.dataService.getEmployees(),
      departments: this.dataService.getDepartments()
    }).pipe(
      catchError(error => of(error))).
        subscribe(val => {
            
          if ((val.employees.status && val.employees.status !== 200) || 
              (val.departments.status && val.departments.status !== 200)) {
            this.error = true;
            return;
          }

          this.employees = val.employees;
          this.departments = val.departments;
        });
  }

  

 

}
