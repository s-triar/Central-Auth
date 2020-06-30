import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  templateUrl: './detail-project.component.html',
  styleUrls: ['./detail-project.component.scss']
})
export class DetailProjectComponent implements OnInit {
  apiname: string;
  project: Project = new Project();

  infoProject = [
    {
      title: 'Pengguna',
      number: 0,
      icon: 'people',
      link: 'user-project'
    },
    {
      title: 'Role',
      number: 0,
      icon: 'verified_user',
      link: 'role-project'
    },
    {
      title: 'Pengikut',
      number: 0,
      icon: 'vertical_align_bottom',
      link: 'follower-project'
    },
    {
      title: 'Mengikuti',
      number: 0,
      icon: 'vertical_align_top',
      link: 'following-project'
    }
  ];

  constructor(private _projectService: ProjectService,
              private _utilityService: UtilityService,
              private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this._activatedRoute.parent.params.subscribe((params: Params) => {
      this._projectService.getProjectDashboard(params['project_name']).subscribe( x => {
        this.project = x.data.project;
        for (let index = 0; index < x.data.infos.length; index++) {
          const element = x.data.infos[index];
          this.infoProject[index].number = element;
        }
      });
    });
  }

  copyText(inputEl) {
    this._utilityService.copyTextFromElement(inputEl);
  }

  goToOutworldLink(url: string) {
    window.open(url, '_blank');
  }
}
