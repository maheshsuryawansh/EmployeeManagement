import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IEmployee } from '../models/employee.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-employee-dialogbox-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './employee-dialogbox-form.component.html',
  styleUrl: './employee-dialogbox-form.component.scss'
})
export class EmployeeDialogboxFormComponent implements OnInit {

  employeeForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeDialogboxFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: IEmployee | null}
  ) {
    this.isEditMode = !!data.employee;
    this.employeeForm = this.fb.group({
      id: [data.employee?.id || null],
      name: [data.employee?.name || '', Validators.required],
      position: [data.employee?.position || '', Validators.required],
      department: [data.employee?.department || '', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.dialogRef.close(this.employeeForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
