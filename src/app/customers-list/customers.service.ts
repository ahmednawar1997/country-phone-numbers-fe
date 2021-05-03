import { SearchObject } from './../searchObject.model';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { Customer } from './Customer.model';



@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) { }


  fetchCustomers = (searchObject: SearchObject): Observable<Customer[]> => {
    return this.http.get<Customer[]>('http://localhost:99', {
      params: new HttpParams()
        .set('page', searchObject.page.toString())
        .set('numPerPage', searchObject.numPerPage.toString())
        .set('state', searchObject.filterState.toString())
        .set('country', searchObject.filterCountry.toString())
    })
      .pipe(catchError(this.errorHandler));
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
