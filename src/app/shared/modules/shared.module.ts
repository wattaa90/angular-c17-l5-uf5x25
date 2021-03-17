import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectedDirective } from "../directives/selected.directive";
import { FilterPipe } from "../pipes/filter.pipe";

@NgModule({
  declarations: [SelectedDirective, FilterPipe],
  imports: [CommonModule],
  exports: [CommonModule, SelectedDirective, FilterPipe]
})
export class SharedModule {}
