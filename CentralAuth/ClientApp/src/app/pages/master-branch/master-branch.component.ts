import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Sort } from 'src/app/models/commons/sort';
import { Branch } from 'src/app/models/branch';
import { MatTableDataSource } from '@angular/material/table';
import { Grid } from 'src/app/models/grid';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BranchService } from 'src/app/services/branch.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { GridResponse } from 'src/app/models/grid-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseContextGetter } from 'src/app/utils/response-context-getter';
import { SnackbarNotifComponent } from 'src/app/components/snackbar-notif/snackbar-notif.component';
import { SnackbarNotifConfig } from 'src/app/models/enums/snackbar-config';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { CreateBranchComponent } from './dialogs/create-branch/create-branch.component';
import { UpdateBranchComponent } from './dialogs/update-branch/update-branch.component';
import { DeleteBranchComponent } from './dialogs/delete-branch/delete-branch.component';

@Component({
  selector: 'app-master-branch',
  templateUrl: './master-branch.component.html',
  styleUrls: ['./master-branch.component.scss']
})
export class MasterBranchComponent implements OnInit, OnDestroy {

  isLoadingResults = false;
  state: Branch = {
    kode : '',
    namaCabang: '',
    alamat: '',
    keterangan: '',
    singkatan: ''
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
      key: 'namaCabang',
      title: 'Nama Cabang'
    },
    {
      key: 'alamat',
      title: 'Alamat'
    },
    {
      key: 'keterangan',
      title: 'Keterangan'
    }
  ];
  columnsKey: string[] = this.columnsConfig.map(col => col.key);
  columnsFilter: string [] = this.columnsConfig.map(col => `search-${col.key}`);
  dataSource: MatTableDataSource<Branch>;
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
    private _branchService: BranchService,
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
    console.log(this.search);
    this.isLoadingResults = true;
    this.dataSubscription = this._branchService.getByFilterGrid(this.search)
                                .subscribe(
                                  (data: GridResponse<Branch>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                    this.isLoadingResults = false;
                                  },
                                  (err: HttpErrorResponse) => {
                                    const context = ResponseContextGetter.GetErrorContext<any>(err);
                                    this._snackbar.openFromComponent(SnackbarNotifComponent, {
                                      duration: SnackbarNotifConfig.DURATION,
                                      data: context,
                                      horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                                      verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
                                    });
                                    this.isLoadingResults = false;
                                  }
                                );
  }
  Add(): void {
    const dialogRef = this._dialog.open(CreateBranchComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: new Branch(),
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  Edit(data: Branch) {
    const dialogRef = this._dialog.open(UpdateBranchComponent, {
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

  Delete(data: Branch) {
    const dialogRef = this._dialog.open(DeleteBranchComponent, {
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
