import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { DataService } from 'src/app/data.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ITFair2';
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData
  }
  constructor(
    public data: DataService,
    private http: HttpClient
  ) { }
  Loading = true
  url = this.data.dataUrl;
  imagePath = ""
  listReqURL = "_vti_bin/ListData.svc/";
  transactionInfo = { EventOrPrice: "", Operation: "" }

  getUrl() {
    return "url('" + this.imagePath + "')";

  }

  getTabName() {
    this.http.get<any>(this.data.url + this.data.listReqURL + "SiteDetails", {
      responseType: 'json'
      , withCredentials: true
    }).subscribe(data1 => {
      this.imagePath = this.data.url + "Picture%20Hub/" + data1.d.results[6].Picture

    })
  }
  CheckIn() {

    this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
      responseType: 'json', withCredentials: true
    }).subscribe(data1 => {
      this.http.get<any>(this.url + this.listReqURL + "Transaction" + "/?$filter=(CreatedBy/WorkEmail eq '" + data1.d.Email + "' and EventOrPrice eq 'CheckIn')", {
        responseType: 'json'
        // , withCredentials: true
      }).subscribe(data => {
        if (data.d.results.length < 1) {
          this.transactionInfo.EventOrPrice = "CheckIn"
          this.transactionInfo.Operation = "CheckIn"
          this.http.post(this.data.url + this.data.listReqURL + "Transaction",
            JSON.stringify(this.transactionInfo)
            , { withCredentials: true }
          ).subscribe(data1 => {
            this.transactionInfo = { EventOrPrice: "", Operation: "" }
            // alert("checked in")

          })
        }
        else {

          let keys: any[] = [];
          let CreateDate = data.d.results[data.d.results.length - 1].Created.replace('/Date(', '')
          data.d.results[data.d.results.length - 1].Created = new Date(parseInt(CreateDate.replace(')/', '')))
          data.d.results[data.d.results.length - 1].Created.setHours(data.d.results[data.d.results.length - 1].Created.getHours() - 7)
          let NowTime = new Date()
          if ((NowTime.getTime() - data.d.results[data.d.results.length - 1].Created.getTime()) / 60000 > 30) { //check in if last time was 30 mins ago
            this.transactionInfo.EventOrPrice = "CheckIn"
            this.transactionInfo.Operation = "CheckIn"
            // this.transactionInfo.Score = 0
            this.http.post(this.data.url + this.data.listReqURL + "Transaction",
              JSON.stringify(this.transactionInfo)
              , { withCredentials: true }
            ).subscribe(data1 => {
              this.transactionInfo = { EventOrPrice: "", Operation: "" }
              // alert("checked in")

            })
          }
        }

      })
    })


  }
  ngOnInit() {
    this.data.getCoinAndCodeName()
    this.getTabName()
    // this.CheckIn()
    this.data.getUserScore()

  }

}
