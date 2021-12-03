import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LandingSiteComponent} from './LandingSite/LandingSite.component'
import { LeaderBoardComponent } from './LeaderBoard/LeaderBoard.component';
import { MyRoomComponent } from './MyRoom/myRoom.component';
import { ShopSiteComponent } from './ShopSite/shopSite.component';
import { HttpClientModule } from '@angular/common/http';
import { AddHeaderInterceptor} from './interceptor.service'
import { LoadingPageComponent } from './loadingPage/loadingPage.component';
import { challengeInfoComponent } from './challengeInfo/challengeInfo.component';
import { ChallengeFormComponent } from './challengeForm/challengeForm.component';
import { SiteInfoComponent } from './SiteInfo/SiteInfo.component';
import {HTTP_INTERCEPTORS } from '@angular/common/http'
import { DataService} from './data.service'
import { FormsModule } from '@angular/forms';
import { Routes,RouterModule } from '@angular/router';

const routes: Routes =[
  { path: '#/Landing-site', component: LandingSiteComponent},
  { path: '#/Leader-Board', component: LeaderBoardComponent},
  { path: '#/My-Room', component: MyRoomComponent},
  { path: '#/Shop-Site', component: ShopSiteComponent},
  { path: '#/challenge-Info', component: challengeInfoComponent},
  { path: '#/Challenge-Form', component: ChallengeFormComponent},
  { path: '**', component: LoadingPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LandingSiteComponent,
    HeaderComponent,
    LeaderBoardComponent,
    SiteInfoComponent,
    MyRoomComponent,
    ShopSiteComponent,
    LoadingPageComponent,
    challengeInfoComponent,
    ChallengeFormComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // RouterModule.forRoot(routes, {useHash :true})
  ],
  providers: [
    DataService,
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true },
    {provide: LocationStrategy, useClass: HashLocationStrategy},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
