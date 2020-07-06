import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CreateUserProjectComponent } from './dialogs/create-user-project/create-user-project.component';
import { DeleteUserProjectComponent } from './dialogs/delete-user-project/delete-user-project.component';
import { RoleUserProjectComponent } from './dialogs/role-user-project/role-user-project.component';
import { ClaimUserProjectComponent } from './dialogs/claim-user-project/claim-user-project.component';
import { ProjectService } from 'src/app/services/project.service';
import { Sort } from 'src/app/models/commons/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { Grid } from 'src/app/models/grid';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { GridResponse } from 'src/app/models/grid-response';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { UserProject } from 'src/app/models/user-project';

@Component({
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.scss']
})
export class UserProjectComponent implements OnInit, OnDestroy {
  apiname = null;
  isLoadingResults = false;
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
    private _projectService: ProjectService,
    private _activatedRoute: ActivatedRoute
    ) {
    this.columnsKey = [...this.columnsKey, ...['claim', 'role', 'delete']];
    this.columnsFilter = [...this.columnsFilter, ...['action-claim', 'action-role', 'action-delete']];
    this.dataSource = new MatTableDataSource([]);
   }

  ngOnInit() {
    this._activatedRoute.parent.params.subscribe((params: Params) => {
      this.apiname = params['project_name'];
    });
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matsort;
    this.FetchData();
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.dataSubscription.unsubscribe();
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
    this.dataSubscription = this._projectService.getListUserByFilterGrid(this.search, this.apiname, true)
                                .subscribe(
                                  (data: GridResponse<User>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  },
                                );
  }
  Add(): void {
    const d = new UserProject();
    d.projekApiName = this.apiname;
    d.pengguna = new User();
    const dialogRef = this._dialog.open(CreateUserProjectComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH + 400,
      data: d,
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  Delete(data: User) {
    const d = new UserProject();
    d.projekApiName = this.apiname;
    d.pengguna = data;
    d.penggunaNik = data.nik ;
    const dialogRef = this._dialog.open(DeleteUserProjectComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: d,
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
        this.dialogSubscription.unsubscribe();
      }
    });

  }
  OpenRole(data: User) {
    const d = new UserProject();
    d.projekApiName = this.apiname;
    d.pengguna = data;
    d.penggunaNik = data.nik ;
    const dialogRef = this._dialog.open(RoleUserProjectComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH + 200,
      data: d,
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
        this.dialogSubscription.unsubscribe();
      }
    });

  }
  OpenClaim(data: User) {
    const d = new UserProject();
    d.projekApiName = this.apiname;
    d.pengguna = data;
    d.penggunaNik = data.nik ;
    const dialogRef = this._dialog.open(ClaimUserProjectComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH + 200,
      data: d,
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
