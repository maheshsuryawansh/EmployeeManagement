import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../services/employee.service';
import { EmployeeDialogboxFormComponent } from '../employee-dialogbox-form/employee-dialogbox-form.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent {

  constructor(
    private _employeeService: EmployeeService,
    private dialog: MatDialog
  ) {
    // this.employees$ = this._employeeService.getEmployees();
  }

  

  dialogBoxPopUp(): void {
    const dialogRef = this.dialog.open(EmployeeDialogboxFormComponent, {
      width: '700px',
      height: '400px',
      data: { employee: null }
    });

    

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        this._employeeService.addEmployee(result).subscribe(() => {
          this._employeeService.triggerRefresh();
        });
      }
    });
  }
}
