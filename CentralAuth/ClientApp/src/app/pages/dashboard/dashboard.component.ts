import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  roles = [];
  nik = null;
  adminCards = [
    {
      title: 'Pengguna',
      number: 0,
      icon: 'people',
      link: ''
    },
    {
      title: 'Projek',
      number: 0,
      icon: 'important_devices',
      link: ''
    },
    {
      title: 'Unit',
      number: 0,
      icon: 'domain',
      link: ''
    },
    {
      title: 'Cabang',
      number: 0,
      icon: 'domain',
      link: ''
    },
    {
      title: 'Direktorat',
      number: 0,
      icon: 'domain',
      link: ''
    },
    {
      title: 'Departemen',
      number: 0,
      icon: 'domain',
      link: ''
    },
    {
      title: 'Sub Departemen',
      number: 0,
      icon: 'domain',
      link: ''
    },
  ];

  devCards = [
    {
      title: 'Projek Dev',
      number: 0,
      icon: 'developer_board',
      link: ''
    }
  ];

  userCards = [
    {
      title: 'Projek Sudah Dikaitkan',
      number: 0,
      icon: 'important_devices',
      link: ''
    }
  ];
  constructor(
    private _authService: AuthService,
    private _dashboardService: DashboardService
  ) {

  }
  ngOnInit(): void {
    this.roles = this._authService.user_roles.value;
    this._authService.user$.subscribe(user => {
      this.nik = user.nik;
      if (this.nik !== null && this.nik !== '') {
        this.fetchData();
      }

    });
  }

  fetchData() {
    for (const role of this.roles) {
      switch (role) {
        case 'SUPERADMIN':
          this._dashboardService.getDashboardDataAdmin().subscribe(
            x => {
              for (let index = 0; index < x.length; index++) {
                const element = x[index];
                this.adminCards[index].number = element;
              }
            }
          );
          this._dashboardService.getDashboardDataDeveloper(this.nik).subscribe(
            x => {
              for (let index = 0; index < x.length; index++) {
                const element = x[index];
                this.devCards[index].number = element;
              }
            }
          );
          this._dashboardService.getDashboardDataUser(this.nik).subscribe(
            x => {
              for (let index = 0; index < x.length; index++) {
                const element = x[index];
                this.userCards[index].number = element;
              }
            }
          );
          break;
        case 'ADMIN':
          this._dashboardService.getDashboardDataAdmin().subscribe(
            x => {
              for (let index = 0; index < x.length; index++) {
                const element = x[index];
                this.adminCards[index].number = element;
              }
            }
          );
          break;
        case 'DEVELOPER':
          this._dashboardService.getDashboardDataDeveloper(this.nik).subscribe(
            x => {
              for (let index = 0; index < x.length; index++) {
                const element = x[index];
                this.devCards[index].number = element;
              }
            }
          );
          break;
        case 'USER':
          this._dashboardService.getDashboardDataUser(this.nik).subscribe(
            x => {
              for (let index = 0; index < x.length; index++) {
                const element = x[index];
                this.userCards[index].number = element;
              }
            }
          );
          break;
        default:
          break;
      }
    }
  }

}
