import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { DataService } from 'src/app/services/data.service';
import { DepartmentOption } from 'src/app/interfaces/department-option';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {

  departments: DepartmentOption[] = [
    {value: 'All Departments', viewValue: 'All Departments'}
  ];
  selectedDepartment: string = this.departments[0].value;
  employees: Employee[] = [];
  error: boolean = false;
  pageIndex = 0;
  pageSize = 6;
  filterMetadata = { count: 0 };
  currentNumberOfPages = 0;
  stringOutputBeforeCurrentPage: string = "";
  stringOutputCurrentPage: string = "";
  stringOutputAfterCurrentPage: string = "";

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private dataService: DataService, private cdRef:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewChecked() {
    this.currentNumberOfPages = this.dataService.setCurrentNumberOfPages(this.filterMetadata.count, this.pageSize);
    this.setStringOutput();
    this.cdRef.detectChanges();
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
          subscribe(val => this.handleForkJoinData(val));
  }

  // Todo create interface to handle forkJoin data, which could also be HttpErrorResponse 
  // See dataService getEmployees() to simulate error response
  handleForkJoinData(val: any) {
    this.error = this.dataService.hasHttpErrorResponse(val);
    if (this.error) return;

    this.dataService.zeroOutEmployeeDataForDemoPurposes(val.employees[0]);
    this.departments.push(...this.dataService.addDepartmentValues(val.departments)); 
    this.employees = val.employees;
  }

  downPage() {
    this.paginator.pageIndex--;
  }

  upPage() {
    this.paginator.pageIndex++;
  }

  changeDepartment() {
    this.paginator.pageIndex = 0;
  }

  // TODO refactor and/or outsource this to service
  setStringOutput(): void {

    if (this.currentNumberOfPages === 1) {
      this.stringOutputBeforeCurrentPage = "";
      this.stringOutputCurrentPage = "1";
      this.stringOutputAfterCurrentPage = "";
      return;
    }

    let stringOutputBeforeCurrentPage = "";
    let stringOutputAfterCurrentPage = "";
    let initialOuput = "1";

    for (let i = 2; i <= this.currentNumberOfPages; i++) {
      initialOuput += i.toString();
    }

    this.stringOutputCurrentPage = (this.paginator.pageIndex + 1).toString();

    const pageArray = initialOuput.split(this.stringOutputCurrentPage);

    for (const page of pageArray) {
      if (page < this.stringOutputCurrentPage) {
         stringOutputBeforeCurrentPage += page;
      } else {
        stringOutputAfterCurrentPage += page;
      }
    }

    this.stringOutputBeforeCurrentPage = stringOutputBeforeCurrentPage;
    this.stringOutputAfterCurrentPage = stringOutputAfterCurrentPage;
  }

}


