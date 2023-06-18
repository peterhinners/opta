import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { DataService } from 'src/app/services/data.service';


import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
// import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
  // imports: [MatFormFieldModule, MatSelectModule, NgFor, MatInputModule, FormsModule]
})
export class MainComponent implements OnInit {

  departments: any[] = [
    {value: 'All Departments', viewValue: 'All Departments'}
  ];
  employees: Employee[] = [];
  filterType: string = "Default";
  selectedDepartment: string = this.departments[0].value;
  error: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getData();
  }

  doSomething() {
    console.log("image loaded");
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

            // TODO remove this
            val.employees[0].avatar = "blah/blah";

            this.employees = val.employees;
            this.setDepartmentValues(val.departments);
            
            console.log("val ", val);
            console.log("employees: ", this.employees);
            console.log("first employee ", this.employees[0].lastName);
        });
  }

  setDepartmentValues(departments: string[]): void {
    departments.forEach(department => {
      this.departments.push({value: department, viewValue: department});
    });
  }

  isVip(hireDate: string): boolean {
    const formattedHireDate = formatDate(new Date(hireDate),'yyyy-MM-dd','en_US');
    const cutoff = formatDate(new Date("2020-01-01"),'yyyy-MM-dd','en_US');
    
 
    if (formattedHireDate < cutoff) {
     
      return true;
     } else {
  
      return false;
     }
  }

}
function sortBy(posts: unknown, arg1: string[]): any {
  throw new Error('Function not implemented.');
}

