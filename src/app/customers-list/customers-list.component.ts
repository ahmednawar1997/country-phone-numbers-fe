import { SearchObject } from './../searchObject.model';
import { CustomersService } from './customers.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from './Customer.model';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent implements OnInit {
  displayedColumns = ["id", "name", "phone", "country", "isValid"];
  customers: Customer[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private customersService: CustomersService) {
    this.customers = []
  }

  ngOnInit(): void {
    const searchObject: SearchObject = { page: 1, numPerPage: 10, filterCountry: 'cameroon', filterState: true };
    this.customersService.fetchCustomers(searchObject).subscribe((customers: Customer[]) => this.customers = customers);
  }

  ngAfterViewInit() {
    const searchObject: SearchObject = {
      page: this.paginator.pageIndex,
      numPerPage: this.paginator.pageSize,
      filterCountry: 'cameroon',
      filterState: true
    };

    this.paginator.page.pipe(
      tap(() => this.customersService.fetchCustomers(searchObject)
        .subscribe((customers: Customer[]) => this.customers = customers))
    );
  }

}
