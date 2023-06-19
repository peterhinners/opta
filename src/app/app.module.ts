import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { SortPipe } from './utility/sort.pipe';
import { FilterPipe } from './utility/filter.pipe';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SortPipe,
    FilterPipe,
    CardComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, MatSelectModule, BrowserAnimationsModule, MatPaginatorModule
  ],
  providers: [DataService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
