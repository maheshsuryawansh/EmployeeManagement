import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../models/employee.model';
import { map, Observable, Subscription } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { EmployeeDialogboxFormComponent } from '../employee-dialogbox-form/employee-dialogbox-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    // MatDialogModule
    MatButtonModule,
    MatDividerModule,
    MatTableModule

  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  private refreshSubscription!: Subscription;
  employees$!: Observable<IEmployee[]>;

  displayedColumns: string[] = ['name', 'position', 'department', 'actions']; // Include 'actions' if applicable



  constructor(
    private _employeeService: EmployeeService,
    private dialog: MatDialog
  ) {
    this.employees$ = this._employeeService.loadData().pipe(
      map(employees => employees ?? [])
    );
//    console.log(this.employees$)
  }
  ngOnInit(): void {
    this.refreshEmployees();  // Load employees on component initialization
    this.refreshSubscription = this._employeeService.refresh$.subscribe(() => {
      this.refreshEmployees();
    });
  }
  refreshEmployees(): void {
    this.employees$ = this._employeeService.loadData().pipe(
      map(employees => employees ?? []) // Handle null by providing an empty array
    );
  }

  deleteEmployee(id: number | undefined): void {
    if (id)
      this._employeeService.deleteEmployee(id).subscribe(() => {
        this._employeeService.triggerRefresh();// Refresh data after deleting
      });
  }

  updateEmployee(employee: IEmployee): void {
    const dialogRef = this.dialog.open(EmployeeDialogboxFormComponent, {
      width: '700px',
      height: '400px',
      data: { employee } // Pass employee data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result) {
        this._employeeService.updateEmployee(result).subscribe(() => {
          this._employeeService.triggerRefresh(); // Notify to refresh data
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }


}
