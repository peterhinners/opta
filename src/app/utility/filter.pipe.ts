import {Pipe, PipeTransform} from '@angular/core';
import { Employee } from '../interfaces/employee';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  public transform(value: Employee[], selectedDepartment: string, filterMetadata: any) {


    let filteredItems = value.filter(employee => {
      if (selectedDepartment === 'All Departments') return true;
      return employee.department === selectedDepartment;
    });

    filterMetadata.count = filteredItems.length;
    return filteredItems;

    // return value.filter(employee => {
    //     if (selectedDepartment === 'All Departments') return true;
    //     return employee.department === selectedDepartment;
    // });

  }
}