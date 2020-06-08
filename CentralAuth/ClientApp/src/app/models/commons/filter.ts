import { GridFilterType } from '../enums/gridfiltertype';


export interface Filter {
    columnName: string;
    filterType: GridFilterType;
    filterValue: string;
}
