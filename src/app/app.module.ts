import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { StoreComponent } from './store/store.component';
import { UpgradeComponent } from './store/upgrade/upgrade.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    StoreComponent,
    UpgradeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
