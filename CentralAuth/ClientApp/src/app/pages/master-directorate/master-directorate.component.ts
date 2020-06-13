import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateDirectorateComponent } from './dialogs/create-directorate/create-directorate.component';
import { Directorate } from 'src/app/models/directorate';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Grid } from 'src/app/models/grid';
import { Filter } from 'src/app/models/commons/filter';
import { Sort } from 'src/app/models/commons/sort';
import { DirectorateService } from 'src/app/services/directorate.service';
import { Subscription } from 'rxjs';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { UpdateDirectorateComponent } from './dialogs/update-directorate/update-directorate.component';
import { DeleteDirectorateComponent } from './dialogs/delete-directorate/delete-directorate.component';
import { GridResponse } from 'src/app/models/grid-response';

@Component({
  selector: 'app-master-directorate',
  templateUrl: './master-directorate.component.html',
  styleUrls: ['./master-directorate.component.scss']
})
export class MasterDirectorateComponent implements OnInit, OnDestroy {
  isLoadingResults = false;
  state: Directorate = {
    kode : '',
    namaDirektorat: ''
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
      key: 'namaDirektorat',
      title: 'Nama Direktorat'
    }
  ];
  columnsKey: string[] = this.columnsConfig.map(col => col.key);
  columnsFilter: string [] = this.columnsConfig.map(col => `search-${col.key}`);
  dataSource: MatTableDataSource<Directorate>;
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
    private _directorateService: DirectorateService
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
    this.dataSubscription = this._directorateService.getByFilterGrid(this.search)
                                .subscribe(
                                  (data: GridResponse<Directorate>) => {
                                    this.lengthData = data.numberData;
                                    this.dataSource = new MatTableDataSource(data.data);
                                  }
                                );
  }
  Add(): void {
    const dialogRef = this._dialog.open(CreateDirectorateComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: new Directorate(),
      role: <any>DialogPopUpConfig.ROLE,
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.FetchData();
      }
    });
  }

  Edit(data: Directorate) {
    const dialogRef = this._dialog.open(UpdateDirectorateComponent, {
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

  Delete(data: Directorate) {
    const dialogRef = this._dialog.open(DeleteDirectorateComponent, {
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
