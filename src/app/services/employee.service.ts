import { Injectable,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmployee } from '../models/employee.model';
import { Observable, Subject } from 'rxjs';
import { CacheService } from './cache.service';
import { tap } from 'rxjs/operators';;

@Injectable({
    providedIn: 'root',
})

export class EmployeeService implements OnInit{
    private refreshSubject = new Subject<void>();
    refresh$ = this.refreshSubject.asObservable();

    apiUrl = 'https://66c60963134eb8f434968c00.mockapi.io/api/employees/employee'

    constructor(private http: HttpClient,private cacheService: CacheService) { }
    ngOnInit() {
        this.loadData();
      }
      
      loadData(): Observable<IEmployee[]> {
        return this.cacheService.cacheObservable(this.apiUrl, this.http.get<IEmployee[]>(this.apiUrl));
      }
    getEmployees(): Observable<IEmployee[]> {
        return this.http.get<IEmployee[]>(this.apiUrl);
    }

    addEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.http.post<IEmployee>(this.apiUrl, employee).pipe(
          tap(() => this.cacheService.clearCache(this.apiUrl)), // Clear cache after adding
          tap(() => this.triggerRefresh()) // Notify subscribers to refresh data
        );
      }
    

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            // Invalidate cache after delete
            tap(() => this.cacheService.clearCache(this.apiUrl)),
            tap(() => this.triggerRefresh())
        );
    }


    updateEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.http.put<IEmployee>(`${this.apiUrl}/${employee.id}`, employee).pipe(
            tap(() => this.cacheService.clearCache(this.apiUrl)), // Clear cache
            tap(() => this.triggerRefresh()) // Trigger refresh
        );
    }


    triggerRefresh() {
        this.refreshSubject.next();
    }
}