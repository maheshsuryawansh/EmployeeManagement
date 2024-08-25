import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { IEmployee } from '../models/employee.model';
import { CacheService } from './cache.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  let cacheService: CacheService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // <-- Import HttpClientTestingModule
      providers: [EmployeeService,CacheService]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheService = TestBed.inject(CacheService);
    spyOn(cacheService, 'clearCache').and.callThrough();  // Spy on clearCache method
    spyOn(service, 'triggerRefresh').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get employees', () => {
    const mockEmployees: IEmployee[] = [
      { id: 1, name: 'John Doe', position: 'Developer', department: 'Engineering' },
      { id: 2, name: 'Jane Smith', position: 'Designer', department: 'Design' }
    ];

    service.getEmployees().subscribe(employees => {
      expect(employees.length).toBeGreaterThan(0);
      expect(employees).toEqual(mockEmployees);
    });

    // Simulate the HTTP request and response
    const req = httpMock.expectOne(service.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });
  it('should add an employee', () => {
    const newEmployee: IEmployee = { id: 3, name: 'Alice Johnson', position: 'Manager', department: 'HR' };

    service.addEmployee(newEmployee).subscribe(employee => {
      expect(employee).toEqual(newEmployee);
      expect(cacheService.clearCache).toHaveBeenCalledWith(service.apiUrl); // Ensure cache is cleared
      expect(service.triggerRefresh).toHaveBeenCalled(); // Ensure refresh is triggered
    });

    const req = httpMock.expectOne(service.apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newEmployee); // Simulate the response
  });

  it('should delete an employee', () => {
    const employeeId = 1;

    service.deleteEmployee(employeeId).subscribe(() => {
      expect(cacheService.clearCache).toHaveBeenCalledWith(service.apiUrl); // Ensure cache is cleared
      expect(service.triggerRefresh).toHaveBeenCalled(); // Ensure refresh is triggered
    });

    const req = httpMock.expectOne(`${service.apiUrl}/${employeeId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simulate the response
  });


  it('should update an employee', () => {
    const updatedEmployee: IEmployee = { id: 1, name: 'John Doe', position: 'Senior Developer', department: 'Engineering' };

    service.updateEmployee(updatedEmployee).subscribe(employee => {
      expect(employee).toEqual(updatedEmployee);
      expect(cacheService.clearCache).toHaveBeenCalledWith(service.apiUrl); // Ensure cache is cleared
      expect(service.triggerRefresh).toHaveBeenCalled(); // Ensure refresh is triggered
    });

    const req = httpMock.expectOne(`${service.apiUrl}/${updatedEmployee.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedEmployee); // Simulate the response
  });



  // Additional tests
});
