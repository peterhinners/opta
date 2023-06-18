import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { SortPipe } from './utility/sort.pipe';
import { FilterPipe } from './utility/filter.pipe';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SortPipe,
    FilterPipe
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, MatInputModule, NgFor, MatSelectModule, MatFormFieldModule, BrowserAnimationsModule
  ],
  providers: [DataService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
