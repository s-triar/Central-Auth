import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Sort } from 'src/app/models/commons/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Grid } from 'src/app/models/grid';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { GridResponse } from 'src/app/models/grid-response';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { Role } from 'src/app/models/role';
import { CreateRoleProjectComponent } from './dialogs/create-role-project/create-role-project.component';
import { DeleteRoleProjectComponent } from './dialogs/delete-role-project/delete-role-project.component';
import { UpdateRoleProjectComponent } from './dialogs/update-role-project/update-role-project.component';
import { ClaimRoleProjectComponent } from './dialogs/claim-role-project/claim-role-project.component';
import { Separator } from 'src/app/models/enums/separator';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './role-project.component.html',
  styleUrls: ['./role-project.component.scss']
})
export class RoleProjectComponent implements OnInit, OnDestroy {
  apiname = null;
  isLoadingResults = false;
  lengthData = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  columnsConfig: any[] = [
    {
      key: 'name',
      title: 'Nama Role'
    },
  ];
  columnsKey: string[] = this.columnsConfig.map(col => col.key);
  columnsFilter: string [] = this.columnsConfig.map(col => `search-${col.key}`);
  dataSource: MatTableDataSource<Role>;
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
    private _router: Router,
    private _activatedRoute: ActivatedRoute
    ) {
    this.columnsKey = [...this.columnsKey, ...[ 'claim', 'edit', 'delete']];
    this.columnsFilter = [...this.columnsFilter, ...[ 'action-claim', 'action-edit', 'action-delete']];
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

    this.dataSubscription = this._projectService.getRoleProjectByFilterGrid(this.search, this.apiname, true)
                                .pipe(
                                  map( (x: GridResponse<Role>) => {
                                    const y = new GridResponse<Role>();
                                    y.numberData = x.numberData;
                                    y.data = x.data.map(z => new Role({
                                      name: z.name.split(Separator)[1],
                                      id: z.id,
                                      project: z.project,
                                      projectApiName: z.projectApiName
                                    }));
                                    return y;
                                  })
                                )
                                .subscribe(
                                  (data: GridResponse<Role>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  }
                                );
  }

  Add(): void {
    const dialogRef = this._dialog.open(CreateRoleProjectComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: this.apiname,
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  Delete(data: Role) {
    const dialogRef = this._dialog.open(DeleteRoleProjectComponent, {
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

  Edit(data: Role) {
    const dialogRef = this._dialog.open(UpdateRoleProjectComponent, {
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

  OpenClaim(data: Role) {
    const dialogRef = this._dialog.open(ClaimRoleProjectComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH + 400,
      data: data,
      role: <any>DialogPopUpConfig.ROLE,
    });
    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }
}
