import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GithubService } from './services/github.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [GithubService],
})
export class SharedModule {}
