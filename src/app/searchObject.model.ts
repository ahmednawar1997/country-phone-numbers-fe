export class SearchObject {

    constructor(
        public page: number,
        public numPerPage: number,
        public filterCountry: string = 'none',
        public filterState: boolean = true,
    ) { }

}