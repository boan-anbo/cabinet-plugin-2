import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {PreviewComponent} from "./preview/preview.component";
import {HealthCheckComponent} from "./health-check/health-check.component";

const routes: Routes = [
  {path: 'preview', component: PreviewComponent},
  {path: 'health', component: HealthCheckComponent},
  {path: '**', redirectTo: 'preview'},
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
