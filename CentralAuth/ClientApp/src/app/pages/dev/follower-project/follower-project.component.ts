import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApprovalFollowerComponent } from './approval-follower/approval-follower.component';
import { Sort } from 'src/app/models/commons/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectToProject } from 'src/app/models/project-to-project';
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
import { DeveloperComponent } from 'src/app/components/developer/developer.component';

@Component({
  templateUrl: './follower-project.component.html',
  styleUrls: ['./follower-project.component.scss']
})
export class FollowerProjectComponent implements OnInit, OnDestroy {
  apiname: string = null;
  lengthData = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  columnsConfig: any[] = [
    {
      key: 'projek.namaProject',
      title: 'Nama Projek'
    },
    {
      key: 'projek.apiName',
      title: 'API'
    },
    {
      key: 'projek.url',
      title: 'URL'
    },
    {
      key: 'projek.type',
      title: 'Kategori Projek'
    },
    {
      key: 'approve',
      title: 'Approval'
    }
  ];
  columnsKey: string[] = this.columnsConfig.map(col => col.key);
  columnsFilter: string [] = this.columnsConfig.map(col => `search-${col.key}`);
  dataSource: MatTableDataSource<ProjectToProject>;
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
    this.columnsKey = [...this.columnsKey, ...['devinfo', 'approval']];
    this.columnsFilter = [...this.columnsFilter, ...['action-devinfo', 'action-approval']];
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
    this.dataSubscription = this._projectService.getFollowersGrid(this.search, this.apiname, true)
                                .subscribe(
                                  (data: GridResponse<ProjectToProject>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  }
                                );
  }

  showData(element: ProjectToProject, key: string) {
    const keys: string[] = key.split('.');
    let el: any = element;
    for (const k of keys) {
      el = el[k];
    }
    return el;
  }
  showIcon(element: ProjectToProject, key: string) {
    const res = element[key];
    if (res === true) {
      return 'check_circle_outline';
    } else if (res === false) {
      return 'highlight_off';
    }
    return 'hourglass_top';
  }
  Approval(data: ProjectToProject) {
    const dialogRef = this._dialog.open(ApprovalFollowerComponent, {
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

  OpenDeveloperInfo(data: ProjectToProject) {
    const dialogRef = this._dialog.open(DeveloperComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: data.projek.developer,
      role: 'dialog',
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

}
