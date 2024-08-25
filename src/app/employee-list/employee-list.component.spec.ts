import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../services/employee.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialogboxFormComponent } from '../employee-dialogbox-form/employee-dialogbox-form.component';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let employeeService: EmployeeService;
  let employeeServiceSpy: jasmine.Spy;
  let dialog: MatDialog;
  let dialogSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EmployeeListComponent],
      providers: [EmployeeService, MatDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService);
    dialog = TestBed.inject(MatDialog);

    // Mock the EmployeeService
    employeeServiceSpy = spyOn(employeeService, 'loadData').and.returnValue(of([
      { id: 1, name: 'John Doe', position: 'Developer', department: 'Engineering' },
      { id: 2, name: 'Maria Doe', position: 'Manager', department: 'HR' }
    ]));

    // Mock the MatDialog
    dialogSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({
        id: 1,
        name: 'John Smith',
        position: 'Lead Developer',
        department: 'Engineering'
      })
    } as any);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh employees', () => {
    spyOn(component, 'refreshEmployees').and.callThrough();

    component.refreshEmployees();
    fixture.detectChanges();

    expect(component.refreshEmployees).toHaveBeenCalled();

    component.employees$.subscribe(employees => {
      expect(employees.length).toBe(2);
      expect(employees[0].name).toBe('John Doe');
      expect(employees[1].name).toBe('Maria Doe');
    });
  });

  it('should call deleteEmployee and refreshEmployees when deleteEmployee is called', () => {
    const deleteSpy = spyOn(employeeService, 'deleteEmployee').and.returnValue(of(void 0));
    const refreshSpy = spyOn(component, 'refreshEmployees').and.callThrough();
    const triggerRefreshSpy = spyOn(employeeService, 'triggerRefresh').and.callThrough();

    component.deleteEmployee(1);

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(triggerRefreshSpy).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should open dialog and update employee when updateEmployee is called', () => {
    const updateSpy = spyOn(employeeService, 'updateEmployee').and.returnValue(of({
      id: 1,
      name: 'John Smith',
      position: 'Lead Developer',
      department: 'Engineering'
    }));
    const triggerRefreshSpy = spyOn(employeeService, 'triggerRefresh').and.callThrough();

    component.updateEmployee({
      id: 1,
      name: 'John Doe',
      position: 'Developer',
      department: 'Engineering'
    });

    // Check if the dialog.open was called with the correct arguments
    expect(dialogSpy).toHaveBeenCalledWith(EmployeeDialogboxFormComponent, {
      width: '700px',
      height: '400px',
      data: { employee: { id: 1, name: 'John Doe', position: 'Developer', department: 'Engineering' } }
    });

    // Ensure updateEmployee was called and refresh triggered
    expect(updateSpy).toHaveBeenCalledWith({
      id: 1,
      name: 'John Smith',
      position: 'Lead Developer',
      department: 'Engineering'
    });
    expect(triggerRefreshSpy).toHaveBeenCalled();
  });
});
