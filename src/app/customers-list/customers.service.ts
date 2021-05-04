import { SearchObject } from './../searchObject.model';
import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { Customer } from './Customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  customersChanged = new Subject<Customer[]>();
  countChanged = new Subject<number>();

  constructor(private http: HttpClient) { }

  fetchCustomers = (searchObject: SearchObject): void => {
    this.http.get<Customer[]>('http://localhost:8080', {
      params: new HttpParams()
        .set('page', searchObject.page.toString())
        .set('numPerPage', searchObject.numPerPage.toString())
        .set('state', searchObject.filterState ? searchObject.filterState.toString() : '')
        .set('country', searchObject.filterCountry ? searchObject.filterCountry.toString() : '')
    })
      .pipe(catchError(this.errorHandler))
      .subscribe((customers: Customer[]) => this.customersChanged.next(customers));

  }

  fetchCustomersCount = (searchObject: SearchObject): void => {
    console.log(searchObject)
    this.http.get<number>('http://localhost:8080/count', {
      params: new HttpParams()
        .set('state', searchObject.filterState ? searchObject.filterState.toString() : '')
        .set('country', searchObject.filterCountry ? searchObject.filterCountry.toString() : '')
    })
      .pipe(catchError(this.errorHandler))
      .subscribe((count: number) => this.countChanged.next(count));
  }


  errorHandler = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}`);
      console.error(error.error);
    }
    return throwError('Error, try again later');
  }
}
