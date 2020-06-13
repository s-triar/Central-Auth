import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SubDepartmentService } from 'src/app/services/sub-department.service';
import { SubDepartment } from 'src/app/models/sub-department';
import { DeleteSubDepartmentComponent } from './dialogs/delete-sub-department/delete-sub-department.component';
import { UpdateSubDepartmentComponent } from './dialogs/update-sub-department/update-sub-department.component';
import { CreateSubDepartmentComponent } from './dialogs/create-sub-department/create-sub-department.component';
import { MatTableDataSource } from '@angular/material/table';
import { Grid } from 'src/app/models/grid';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { GridResponse } from 'src/app/models/grid-response';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { Sort } from 'src/app/models/commons/sort';

@Component({
  selector: 'app-master-sub-department',
  templateUrl: './master-sub-department.component.html',
  styleUrls: ['./master-sub-department.component.scss']
})
export class MasterSubDepartmentComponent implements OnInit, OnDestroy {

  isLoadingResults = false;
  state: SubDepartment = {
    kode : '',
    namaSubDepartemen: '',
    departemenKode: ''
  };
  lengthData = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  columnsConfig: any[] = [
    {
      key: 'kode',
      title: 'Kode'
    },
    {
      key: 'namaSubDepartemen',
      title: 'Nama Sub Departemen'
    },
    {
      key: 'departemen.namaDepartemen',
      title: 'Departemen'
    }
  ];
  columnsKey: string[] = this.columnsConfig.map(col => col.key);
  columnsFilter: string [] = this.columnsConfig.map(col => `search-${col.key}`);
  dataSource: MatTableDataSource<SubDepartment>;
  search: Grid = {
    filter: [],
    sort: [],
    pagination: {
      numberDisplay: this.pageSize,
      pageNumber: 1
    }
  };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matsort: MatSort;

  // DATAS: SubDepartment[] = [];
  dataSubscription: Subscription;
  dialogSubscription: Subscription;
  constructor(
    private _dialog: MatDialog,
    private _subDepartmentService: SubDepartmentService
    ) {
    this.columnsKey = [...this.columnsKey, ...['edit', 'delete']];
    this.columnsFilter = [...this.columnsFilter, ...['action-edit', 'action-delete']];
    this.dataSource = new MatTableDataSource([]);
   }

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matsort;
    this.FetchData();
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.dataSubscription.unsubscribe();
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    for (const key in this.state) {
      if (this.state.hasOwnProperty(key)) {
        this.constructFilterData(value, key);
      }
    }
    this.FetchData();
  }


  filterColumn(event: Event, namaColumn: string) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const key = this.cleanColumnFilterKey(namaColumn);
    this.constructFilterData(value, key);
    this.FetchData();
  }
  sortColumn(event) {
   const sort: Sort = {
      columnName: this.matsort.active,
      sortType: this.matsort.direction.toUpperCase()
   };
   this.search.sort = [sort];
   this.FetchData();
  }
  constructFilterData(value, key) {
    const index = this.search.filter.findIndex(x => x.columnName === key);
    if (value === '' || value === null) {
      if (index !== -1) {
        this.search.filter = this.search.filter.filter(x => x.columnName !== key);
      }
    } else {
      if (index === -1) {
        const filter: Filter = {
          columnName: key,
          filterType: GridFilterType.CONTAIN,
          filterValue: value
        };
        this.search.filter.push(filter);
      } else {
        this.search.filter[index].filterValue = value;
      }
    }
  }

  cleanColumnFilterKey(key: string) {
    key = key.split('-')[1];
    return key;
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.search.pagination.pageNumber = event.pageIndex + 1;
    this.search.pagination.numberDisplay = event.pageSize;
    this.FetchData();
  }

  FetchData() {
    this.dataSubscription = this._subDepartmentService.getByFilterGrid(this.search)
                                .subscribe(
                                  (data: GridResponse<SubDepartment>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  },
                                );
  }
  Add(): void {
    const dialogRef = this._dialog.open(CreateSubDepartmentComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: new SubDepartment(),
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  Edit(data: SubDepartment) {
    const dialogRef = this._dialog.open(UpdateSubDepartmentComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: data,
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  Delete(data: SubDepartment) {
    const dialogRef = this._dialog.open(DeleteSubDepartmentComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: data,
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
        this.dialogSubscription.unsubscribe();
      }
    });

  }

}
