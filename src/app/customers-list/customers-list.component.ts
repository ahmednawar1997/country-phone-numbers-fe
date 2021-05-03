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
  countries = ["All", "Cameroon", "Ethiopia", "Morocco", "Mozambique", "Uganda"];
  states = ["All", "Not Valid", "Valid"];

  customers: Customer[];
  customersCount: number;

  filterCountry: string = '';
  filterState: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private customersService: CustomersService) {
    this.customers = [];
    this.customersCount = 0;
  }

  ngOnInit(): void {
    const searchObject: SearchObject = { page: 0, numPerPage: 5, filterCountry: 'Cameroon', filterState: true };
    this.customersService.fetchCustomers(searchObject).subscribe((customers: Customer[]) => this.customers = customers);
    this.customersService.fetchCustomersCount(searchObject).subscribe((count: number) => this.customersCount = count);
  }

  ngAfterViewInit() {

    this.paginator.page.pipe(
      tap(() => this.customersService.fetchCustomers(this.getSearchObject())
        .subscribe((customers: Customer[]) => {
          this.customers = customers
        }))
    ).subscribe();;
  }

  getSearchObject = (): SearchObject => {
    const searchObject: SearchObject = {
      page: this.paginator.pageIndex,
      numPerPage: this.paginator.pageSize,
      filterCountry: 'Cameroon',
      filterState: true
    };
    console.log(searchObject)
    return searchObject;
  }

}
