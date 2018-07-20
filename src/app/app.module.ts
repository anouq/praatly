import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ExplanationComponent } from './explanation/explanation.component';
import { MenuComponent } from './menu/menu.component';
import { StatsComponent } from './stats/stats.component';
import { PlotComponent } from './stats/plot/plot.component';
import { TableComponent } from './stats/table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    ExplanationComponent,
    MenuComponent,
    StatsComponent,
    PlotComponent,
    TableComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
