import { Filter } from './commons/filter';
import { Sort } from './commons/sort';
import { Pagination } from './commons/pagination';

export class Grid {
    filter: Filter[];
    sort: Sort[];
    pagination: Pagination;
}
