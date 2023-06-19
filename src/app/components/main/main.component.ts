import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { DataService } from 'src/app/services/data.service';
import { DepartmentOption } from 'src/app/interfaces/department-option';
import { ChildComponent } from '../child/child.component';

import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;


  departments: DepartmentOption[] = [
    {value: 'All Departments', viewValue: 'All Departments'}
  ];
  employees: Employee[] = [];
  filterType: string = "Default";
  selectedDepartment: string = this.departments[0].value;
  error: boolean = false;
  employeeCount!: number;
  photoCount: number = 0;
  allPhotosLoaded: boolean = false;


  // length=14;
  pageIndex = 0;
  pageSize = 6;
  filterMetadata = { count: 0 };
  currentNumberOfPages = 0;
  stringOutput: string = "1";
  // initialCount = 0;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private dataService: DataService, private el: ElementRef<HTMLElement>, private cdRef:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getData();
  }

  setCurrentNumberOfPages() {
    this.currentNumberOfPages = Math.ceil(this.filterMetadata.count / this.pageSize);
  }

  setStringOutput() {
    
    // if (this.stringOutput.length >= this.currentNumberOfPages) return;


    this.stringOutput = '1';
    if (this.currentNumberOfPages === 1) return;

    let cols = [];
    for (let i = 2; i <= this.currentNumberOfPages; i++) {
      this.stringOutput += i.toString();
      // cols.push(i * i);
      console.log("i, ", i)
    }

    // return this.stringOutput;
  }

  downPage() {
    this.paginator.pageIndex--;
  }

  upPage() {
    this.paginator.pageIndex++;
  }

  ngAfterViewChecked() {
    this.setCurrentNumberOfPages();
    this.setStringOutput();
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
   
  }


  changePage(event:PageEvent){
    console.log("you're in page index",event.pageIndex);
    
    // ..make something more...
  }

  changeDepartment() {
    console.log("current index before: ", this.pageIndex);
    console.log("should be changing index");
    this.paginator.pageIndex = 0;
  

    console.log("current index after: ", this.pageIndex);
    // this.pageIndex = 0;
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
              console.log("this.error: ", this.error);
              return;
            }

            // Zero-ing out these values to demonstrate missing info in the UI per mockup
            val.employees[0].avatar = "blah/blah";
            val.employees[0].firstName = "";
            val.employees[0].position = "";
            val.employees[0].department = "";


            this.employeeCount = val.employees.length;
            this.employees = val.employees;
            this.addDepartmentValues(val.departments);
      
            
            console.log("val ", val);
            console.log("employees: ", this.employees);
            console.log("this.employeeCount ", this.employeeCount);
        });
  }

  addDepartmentValues(departments: string[]): void {
    departments.forEach(department => {
      const departmentOption: DepartmentOption = {value: department, viewValue: department};
      this.departments.push(departmentOption);
    });
  }

  isVip(hireDate: string): boolean {
    const formattedHireDate = formatDate(new Date(hireDate),'yyyy-MM-dd','en_US');
    const cutoff = formatDate(new Date("2020-01-01"),'yyyy-MM-dd','en_US');
    if (formattedHireDate < cutoff) return true;
    return false;
  }

  missingPhoto(employee: Employee) {
    employee.avatar = '/assets/missingImage.jpg';
    employee.missingImage = true;
  }

  tallyPhoto() {
    this.photoCount++;
    if (this.photoCount === this.employeeCount) this.allPhotosLoaded = true;
  }

}


