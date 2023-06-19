import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Employee } from 'src/app/interfaces/employee';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})



export class CardComponent {

  @Input()
  employee!: Employee;

  missingPhoto(employee: Employee) {
    employee.avatar = '/assets/missingImage.jpg';
    employee.missingImage = true;
  }

  isVip(hireDate: string): boolean {
    const formattedHireDate = formatDate(new Date(hireDate),'yyyy-MM-dd','en_US');
    const cutoff = formatDate(new Date("2020-01-01"),'yyyy-MM-dd','en_US');
    if (formattedHireDate < cutoff) return true;
    return false;
  }

}
