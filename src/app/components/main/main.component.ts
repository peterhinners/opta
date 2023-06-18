import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { DataService } from 'src/app/services/data.service';
import { DepartmentOption } from 'src/app/interfaces/department-option';
import { ChildComponent } from '../child/child.component';

import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import { ChangeDetectorRef } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;

  displayedColumns: string[] = ['Employees', 'weight'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  // @ViewChild(MatPaginator)
  // paginator!: MatPaginator;

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }



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
  pageIndex=0;
  pageSize=6;
  filterMetadata = { count: 0 };
  initialCount = 14;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private dataService: DataService, private cdRef:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
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

            // TODO remove this
            val.employees[0].avatar = "blah/blah";

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

  tallyPhoto() {
    this.photoCount++;
    if (this.photoCount === this.employeeCount) this.allPhotosLoaded = true;
  }

}


