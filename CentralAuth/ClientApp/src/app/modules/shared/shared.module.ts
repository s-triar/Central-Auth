import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CardInfoComponent } from '../../components/card-info/card-info.component';
import { ProjectService } from 'src/app/services/project.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CardHoverDirective } from '../../directives/card-hover.directive';
import { ChangeIconOnHoverDirective } from 'src/app/directives/change-icon-on-hover.directive';
import { DeveloperComponent } from 'src/app/components/developer/developer.component';
import { ReactiveFormsModule } from '@angular/forms';

const listModules: any[]  = [
  MaterialModule,
  FlexLayoutModule
];

@NgModule({
  declarations: [CardInfoComponent, CardHoverDirective, ChangeIconOnHoverDirective, DeveloperComponent],
  imports: [
    CommonModule,
    listModules,
    ReactiveFormsModule
  ],
  exports: [
    CardInfoComponent,
    CardHoverDirective,
    ChangeIconOnHoverDirective,
    listModules,
    DeveloperComponent
  ],
  entryComponents: [DeveloperComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [ProjectService, UtilityService],
    };
  }
}
