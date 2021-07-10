import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphComponentComponent } from './graph-component/graph-component.component';
import { ExportAsModule } from 'ngx-export-as';

@NgModule({
  declarations: [
    AppComponent, GraphComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ExportAsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
