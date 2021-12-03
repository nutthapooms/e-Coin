import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DataService } from '../data.service';


@Component({
  selector: 'Loading-Page',
  templateUrl: './loadingPage.component.html',
  styleUrls: ['./loadingPage.component.css']
})
export class LoadingPageComponent {
  title = 'ITFair2';
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData
  }
  constructor(
      private routing : Router,
      private data : DataService,
      private http : HttpClient
  ) { }
  Loading = true

  url = this.data.dataUrl;
  imagePath = this.data.dataUrl + "Picture%20Hub/Background_Buttom.svg"
  listReqURL = "_vti_bin/ListData.svc/"
  transactionInfo = { EventOrPrice: "", Operation: "" }
  leaderBoard: any[] = []
  Challenges: any[] = []

 
  ngOnInit() {
    this.transactionInfo.EventOrPrice = "CheckIn"
    this.transactionInfo.Operation = "CheckIn"
    // this.transactionInfo.Score = 0
    this.http.post(this.url + this.listReqURL + "Transaction",
      JSON.stringify(this.transactionInfo)
      , { withCredentials: true }
    ).subscribe(data1 => {

    })
    this.data.currentReturnLocation.subscribe(message=>{
      setTimeout(()=>{this.routing.navigate([message])},500)
    })
  }

}
