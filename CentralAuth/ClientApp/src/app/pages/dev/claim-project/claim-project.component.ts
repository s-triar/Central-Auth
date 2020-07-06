import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ClaimProject } from 'src/app/models/claim-project';
import { Sort } from 'src/app/models/commons/sort';
import { CreateClaimProjectComponent } from './dialogs/create-claim-project/create-claim-project.component';
import { DeleteClaimProjectComponent } from './dialogs/delete-claim-project/delete-claim-project.component';
import { UpdateClaimProjectComponent } from './dialogs/update-claim-project/update-claim-project.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
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
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { map } from 'rxjs/operators';
import { Separator } from 'src/app/models/enums/separator';

@Component({
  selector: 'app-claim-project',
  templateUrl: './claim-project.component.html',
  styleUrls: ['./claim-project.component.scss']
})
export class ClaimProjectComponent implements OnInit, OnDestroy {
  apiname: string = null;
  isLoadingResults = false;
  lengthData = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  columnsConfig: any[] = [
    {
      key: 'claimName',
      title: 'Nama Claim'
    },
  ];
  columnsKey: string[] = this.columnsConfig.map(col => col.key);
  columnsFilter: string [] = this.columnsConfig.map(col => `search-${col.key}`);
  dataSource: MatTableDataSource<ClaimProject>;
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
    this.columnsKey = [...this.columnsKey, ...['edit', 'delete']];
    this.columnsFilter = [...this.columnsFilter, ...['action-edit', 'action-delete']];
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
    this.dataSubscription = this._projectService.getClaimProjectByFilterGrid(this.search, this.apiname, true )
                                .pipe(
                                  map( (x: GridResponse<ClaimProject>) => {
                                    const y = new GridResponse<ClaimProject>();
                                    y.numberData = x.numberData;
                                    y.data = x.data.map(z => new ClaimProject({
                                      claimName: z.claimName.split(Separator)[1],
                                      id: z.id,
                                      projek: z.projek,
                                      projekApiName: z.projekApiName
                                    }));
                                    return y;
                                  })
                                )
                                .subscribe(
                                  (data: GridResponse<ClaimProject>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  }
                                );
  }

  Add(): void {
    const dialogRef = this._dialog.open(CreateClaimProjectComponent, {
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

  Delete(data: ClaimProject) {
    const dialogRef = this._dialog.open(DeleteClaimProjectComponent, {
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

  Edit(data: ClaimProject) {
    const dialogRef = this._dialog.open(UpdateClaimProjectComponent, {
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
