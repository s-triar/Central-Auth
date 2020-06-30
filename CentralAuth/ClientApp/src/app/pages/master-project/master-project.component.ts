import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Project } from 'src/app/models/project';
import { MatTableDataSource } from '@angular/material/table';
import { Grid } from 'src/app/models/grid';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from 'src/app/models/commons/sort';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { GridResponse } from 'src/app/models/grid-response';
import { ProjectService } from 'src/app/services/project.service';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { DeleteProjectComponent } from './dialogs/delete-project/delete-project.component';
import { CreateProjectComponent } from './dialogs/create-project/create-project.component';
import { User } from 'src/app/models/user';
import { DeveloperComponent } from './dialogs/developer/developer.component';
import { ListUserComponent } from './dialogs/list-user/list-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master-project',
  templateUrl: './master-project.component.html',
  styleUrls: ['./master-project.component.scss']
})
export class MasterProjectComponent implements OnInit, OnDestroy {
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
    collaborations: [],
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
    }
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
    private _router: Router
    ) {
    this.columnsKey = [...this.columnsKey, ...['userlist', 'devinfo', 'edit', 'delete']];
    this.columnsFilter = [...this.columnsFilter, ...['action-userlist', 'action-devinfo', 'action-edit', 'action-delete']];
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
    this.dataSubscription = this._projectService.getByFilterGrid(this.search)
                                .subscribe(
                                  (data: GridResponse<Project>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  }
                                );
  }

  Add(): void {
    const dialogRef = this._dialog.open(CreateProjectComponent, {
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
    const dialogRef = this._dialog.open(DeleteProjectComponent, {
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

  OpenDeveloperInfo(data: Project) {
    const dialogRef = this._dialog.open(DeveloperComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: data.developer,
      role: 'dialog',
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  OpenListUser(data: Project) {
    const dialogRef = this._dialog.open(ListUserComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: data,
      role: 'dialog',
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }


}
