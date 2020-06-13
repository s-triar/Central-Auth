import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { Sort } from 'src/app/models/commons/sort';
import { Grid } from 'src/app/models/grid';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { GridResponse } from 'src/app/models/grid-response';
import { CreateUserComponent } from './dialogs/create-user/create-user.component';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { UpdateUserComponent } from './dialogs/update-user/update-user.component';
import { DeleteUserComponent } from './dialogs/delete-user/delete-user.component';
import { RoleUserComponent } from './dialogs/role-user/role-user.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

@Component({
  selector: 'app-master-user',
  templateUrl: './master-user.component.html',
  styleUrls: ['./master-user.component.scss'],
})
export class MasterUserComponent implements OnInit, OnDestroy {
  isLoadingResults = false;
  state: User = {
    nik : '',
    atasanNik: '',
    email: '',
    ext: '',
    nama: '',
    departemenKode: '',
    subDepartemenKode: '',
    cabangKode: '',
    direktoratKode: '',
    unitKode: ''
  };
  lengthData = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  columnsConfig: any[] = [
    {
      key: 'nik',
      title: 'NIK'
    },
    {
      key: 'nama',
      title: 'Nama'
    },
    {
      key: 'email',
      title: 'Email'
    },
    {
      key: 'ext',
      title: 'Ext'
    },
    {
      key: 'atasanNik',
      title: 'Nik Atasan'
    },
    {
      key: 'atasan.nik',
      title: 'Atasan'
    },
    {
      key: 'cabang.namaCabang',
      title: 'Cabang'
    },
    {
      key: 'unit.namaUnit',
      title: 'Unit'
    },
    {
      key: 'direktorat.namaDirektorat',
      title: 'Direktorat'
    },
    {
      key: 'departemen.namaDepartemen',
      title: 'Departemen'
    },
    {
      key: 'subDepartemen.namaSubDepartemen',
      title: 'Sub Departemen'
    }
  ];
  columnsKey: string[] = this.columnsConfig.map(col => col.key);
  columnsFilter: string [] = this.columnsConfig.map(col => `search-${col.key}`);
  dataSource: MatTableDataSource<User>;
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
    private _userService: UserService,
    ) {
    this.columnsKey = [...this.columnsKey, ...['edit', 'delete', 'role']];
    this.columnsFilter = [...this.columnsFilter, ...['action-edit', 'action-delete', 'action-role']];
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

  showData(element: User, key: string) {
    const keys: string[] = key.split('.');
    let el: any = element;
    for (const k of keys) {
      el = el[k];
    }
    return el;
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
    this.dataSubscription = this._userService.getByFilterGrid(this.search)
                                .subscribe(
                                  (data: GridResponse<User>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  },
                                );
  }
  Add(): void {
    const dialogRef = this._dialog.open(CreateUserComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH + 400,
      data: new User(),
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  Edit(data: User) {
    const dialogRef = this._dialog.open(UpdateUserComponent, {
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

  Delete(data: User) {
    const dialogRef = this._dialog.open(DeleteUserComponent, {
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
  Role(data: User) {
    const dialogRef = this._dialog.open(RoleUserComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH + 200,
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
