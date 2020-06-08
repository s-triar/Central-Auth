import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateDirectorateComponent } from './dialogs/create-directorate/create-directorate.component';
import { Directorate } from 'src/app/models/directorate';
import { DialogLoadingComponent } from 'src/app/components/dialog-loading/dialog-loading.component';
import { DialogPopUpConfig } from 'src/app/models/enums/dialog-config';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Grid } from 'src/app/models/grid';
import { Filter } from 'src/app/models/commons/filter';
import { Sort } from 'src/app/models/commons/sort';
import { Pagination } from 'src/app/models/commons/pagination';
import { DirectorateService } from 'src/app/services/directorate.service';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';

@Component({
  selector: 'app-master-directorate',
  templateUrl: './master-directorate.component.html',
  styleUrls: ['./master-directorate.component.scss']
})
export class MasterDirectorateComponent implements OnInit, OnDestroy {

  search: Grid;
  filter: Filter = {
    columnName: 'kode',
    filterType: GridFilterType.CONTAIN,
    filterValue: '0'
  };
  sort: Sort = {
    columnName: 'namaDirektorat',
    sortType: 'ASC'
  };
  Page: Pagination;

  lengthData = 200;
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


  dataSource: MatTableDataSource<Directorate>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matsort: MatSort;

  DATAS: Directorate[] = [
    {
      kode: '01',
      namaDirektorat: 'Directorate 1'
    },
    {
      kode: '02',
      namaDirektorat: 'Directorate 2'
    },
    {
      kode: '03',
      namaDirektorat: 'Directorate 3'
    },
    {
      kode: '04',
      namaDirektorat: 'Directorate 4'
    },
    {
      kode: '05',
      namaDirektorat: 'Directorate 5'
    },
    {
      kode: '06',
      namaDirektorat: 'Directorate 6'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    },
    {
      kode: '07',
      namaDirektorat: 'Directorate 7'
    }
  ];

  data$: any;
  dataSubscription: Subscription;
  constructor(private _dialog: MatDialog, private _directorateService: DirectorateService) {
    this.columnsKey.push('edit');
    this.columnsKey.push('delete');
    this.dataSource = new MatTableDataSource(this.DATAS);
    this.search = new Grid();
    this.search.filter = [this.filter];
    this.search.sort = [this.sort];
    this.search.pagination = {
      numberDisplay: this.pageSize,
      pageNumber: 1
    };

   }

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matsort;
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.dataSubscription.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fetchData() {
    this.dataSubscription = this._directorateService.getByFilterGrid(this.search)
    // this.dataSubscription = this._directorateService.getAll()
    .pipe(
      map(d => {
        const res: Directorate[] = [];
        d.forEach(element => {
          console.log(element);
          console.log(new Directorate(element));
          res.push(new Directorate(element));
        });
        return res;
      })
    )
    .subscribe(data => {
      console.log(data);
      this.data$ = data;
    });
  }

  onPageEvent(event: PageEvent) {
    console.log(event);
  }

  Add(): void {
    const dialogRef = this._dialog.open(CreateDirectorateComponent, {
      minWidth: DialogPopUpConfig.MIN_WIDTH,
      data: new Directorate(),
      role: <any>DialogPopUpConfig.ROLE,
      ariaLabelledBy: 'create-directorate',
      ariaLabel: 'Create or Update Directorate Data',
      ariaDescribedBy: 'Dialog which has form to input data of directorate',
      id: 'create-directorate'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {

      }
    });
  }

  Edit(data: any) {

  }

  Delete(data: any) {

  }




}
