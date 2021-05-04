import { SearchObject } from './../searchObject.model';
import { CustomersService } from './customers.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from './Customer.model';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent implements OnInit {
  displayedColumns = ["id", "name", "phone", "country", "isValid"];
  countries = ["", "Cameroon", "Ethiopia", "Morocco", "Mozambique", "Uganda"];
  states = ["", "true", "false"];

  customers: Customer[];
  customersCount: number;

  filterCountry: string = '';
  filterState: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private customersService: CustomersService) {
    this.customers = [];
    this.customersCount = 0;
  }

  ngOnInit(): void {
    const searchObject: SearchObject = { page: 0, numPerPage: 5 };
    this.customersService.customersChanged.subscribe((customers: Customer[]) => this.customers = customers);
    this.customersService.countChanged.subscribe((count: number) => this.customersCount = count);
    this.fetchNewData(searchObject);
  }

  ngAfterViewInit() {

    this.paginator.page.pipe(
      tap(() => this.customersService.fetchCustomers(this.getSearchObject()))
    ).subscribe();
  }

  getSearchObject = (): SearchObject => {
    const searchObject: SearchObject = {
      page: this.paginator.pageIndex,
      numPerPage: this.paginator.pageSize,
      filterCountry: this.filterCountry,
      filterState: this.filterState
    };
    return searchObject;
  }

  onCountryChange = (countryEvent: MatSelectChange) => {
    this.filterCountry = countryEvent.value;
    this.fetchNewData(this.getSearchObject());
  }
  onStateChange = (stateEvent: MatSelectChange) => {
    this.filterState = stateEvent.value;
    this.fetchNewData(this.getSearchObject());
  }

  fetchNewData = (searchObject: SearchObject) => {
    this.customersService.fetchCustomersCount(searchObject);
    this.customersService.fetchCustomers(searchObject);
  }

}
