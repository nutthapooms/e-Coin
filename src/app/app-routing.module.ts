import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { challengeInfoComponent } from './challengeInfo/challengeInfo.component';
import { LandingSiteComponent } from './LandingSite/LandingSite.component';
import { LeaderBoardComponent } from './LeaderBoard/LeaderBoard.component';
import { LoadingPageComponent } from './loadingPage/loadingPage.component';
import { MyRoomComponent } from './MyRoom/myRoom.component';
import { ChallengeFormComponent } from './challengeForm/challengeForm.component';
import { ShopSiteComponent } from './ShopSite/shopSite.component';
import { SiteInfoComponent } from './SiteInfo/SiteInfo.component';
import { QuizComponent } from './Quiz/Quiz.component';


const routes: Routes = [
  { path: 'Landing-site', component: LandingSiteComponent, data: {animation: 'BrowseOption'} },
  { path: 'Leader-Board', component: LeaderBoardComponent},
  { path: 'My-Room', component: MyRoomComponent},
  { path: 'Shop-Site', component: ShopSiteComponent},
  { path: 'challenge-Info', component: challengeInfoComponent},
  { path: 'Site-Info', component: SiteInfoComponent},
  { path: 'Challenge-Form', component: ChallengeFormComponent},
  { path: 'Quiz', component: QuizComponent},
  { path: '**', component: LoadingPageComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}

