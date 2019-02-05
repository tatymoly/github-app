import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UserFormComponent } from './user-form.component';
import { UserFormRoutingModule } from './user-form-routing.module';
import { GithubService } from '../shared/services/github.service';

import { MaterialModule } from '../../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    MaterialModule,
    UserFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [GithubService, DatePipe],
  exports: [UserFormComponent],
})
export class UserFormModule {}
