import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { DataService } from 'src/app/services/data.service';
import { DepartmentOption } from 'src/app/interfaces/department-option';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

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

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
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


