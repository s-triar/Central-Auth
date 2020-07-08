import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Sort } from 'src/app/models/commons/sort';
import { Project } from 'src/app/models/project';
import { MatTableDataSource } from '@angular/material/table';
import { Grid } from 'src/app/models/grid';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { GridResponse } from 'src/app/models/grid-response';
import { CreateMyProjectComponent } from './dialogs/create-my-project/create-my-project.component';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { DeleteMyProjectComponent } from './dialogs/delete-my-project/delete-my-project.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.scss']
})
export class MyProjectComponent implements OnInit, OnDestroy {
  nik: any;
  isLoadingResults = false;
  state: Project = {
    apiName : '',
    clientId: '',
    developerNik: '',
    clientSecret: '',
    developer: null,
    namaProject: '',
    type: '',
    url: '',
    followers: [],
    followings: [],
    roles: [],
    users: []
  };
  lengthData = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  columnsConfig: any[] = [
    {
      key: 'apiName',
      title: 'Nama API'
    },
    {
      key: 'namaProject',
      title: 'Nama Projek'
    },
    {
      key: 'url',
      title: 'URL Projek'
    },
    {
      key: 'type',
      title: 'Kategori Projek'
    },
  ];
  columnsKey: string[] = this.columnsConfig.map(col => col.key);
  columnsFilter: string [] = this.columnsConfig.map(col => `search-${col.key}`);
  dataSource: MatTableDataSource<Project>;
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
    private _authService: AuthService,
    private _router: Router,
    private _route: ActivatedRoute
    ) {
    this.columnsKey = [...this.columnsKey, ...['edit', 'delete']];
    this.columnsFilter = [...this.columnsFilter, ...['action-edit', 'action-delete']];
    this.dataSource = new MatTableDataSource([]);
   }

  ngOnInit() {
    this.nik = this._authService.user.value.nik;
    const filter: Filter = {
      columnName: 'developerNik',
      filterType: GridFilterType.EQUAL,
      filterValue: this.nik
    };
    this.search.filter.push(filter);
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
    this.dataSubscription = this._projectService.getByFilterGrid(this.search)
                                .subscribe(
                                  (data: GridResponse<Project>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  }
                                );
  }

  Add(): void {
    const dialogRef = this._dialog.open(CreateMyProjectComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: new Project(),
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  Delete(data: Project) {
    const dialogRef = this._dialog.open(DeleteMyProjectComponent, {
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

  Edit(data: Project) {
    // pergi ke halaman projek
    this._router.navigate(['dev', data.apiName, 'dashboard']);
  }

}
