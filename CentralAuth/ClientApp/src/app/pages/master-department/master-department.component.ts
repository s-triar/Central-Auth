import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Department } from 'src/app/models/department';
import { MatTableDataSource } from '@angular/material/table';
import { Grid } from 'src/app/models/grid';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from 'src/app/services/department.service';
import { GridResponse } from 'src/app/models/grid-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseContextGetter } from 'src/app/utils/response-context-getter';
import { SnackbarNotifConfig } from 'src/app/models/enums/snackbar-config';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { SnackbarNotifComponent } from 'src/app/components/snackbar-notif/snackbar-notif.component';
import { CreateDepartmentComponent } from './dialogs/create-department/create-department.component';
import { UpdateDepartmentComponent } from './dialogs/update-department/update-department.component';
import { DeleteDepartmentComponent } from './dialogs/delete-department/delete-department.component';
import { Sort } from 'src/app/models/commons/sort';

@Component({
  selector: 'app-master-department',
  templateUrl: './master-department.component.html',
  styleUrls: ['./master-department.component.scss']
})
export class MasterDepartmentComponent implements OnInit, OnDestroy {

  isLoadingResults = false;
  state: Department = {
    kode : '',
    namaDepartemen: '',
    direktoratKode: ''
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
      key: 'namaDepartemen',
      title: 'Nama Departemen'
    },
    {
      key: 'direktorat.namaDirektorat',
      title: 'Direktorat'
    }
  ];
  columnsKey: string[] = this.columnsConfig.map(col => col.key);
  columnsFilter: string [] = this.columnsConfig.map(col => `search-${col.key}`);
  dataSource: MatTableDataSource<Department>;
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

  // DATAS: Directorate[] = [];
  dataSubscription: Subscription;
  dialogSubscription: Subscription;
  constructor(
    private _dialog: MatDialog,
    private _departmentService: DepartmentService,
    private _snackbar: MatSnackBar
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
    this.dataSubscription = this._departmentService.getByFilterGrid(this.search)
                                .subscribe(
                                  (data: GridResponse<Department>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  },
                                );
  }
  Add(): void {
    const dialogRef = this._dialog.open(CreateDepartmentComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: new Department(),
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  Edit(data: Department) {
    const dialogRef = this._dialog.open(UpdateDepartmentComponent, {
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

  Delete(data: Department) {
    const dialogRef = this._dialog.open(DeleteDepartmentComponent, {
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
