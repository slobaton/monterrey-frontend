import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectListComponent} from './pages/effect-list/effect-list.component';

const routes: Routes = [
  { path: '', component: EffectListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EffectRoutingModule { }
