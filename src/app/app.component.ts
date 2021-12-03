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


  getUrl() {
    return "url('" + this.imagePath + "')";

  }
 
  getTabName() {
    this.http.get<any>(this.url + this.listReqURL + "SiteDetails", {
      responseType: 'json'
      , withCredentials: true
    }).subscribe(data => {
      this.imagePath = this.url + "Picture%20Hub/" + data.d.results[6].Picture

    })
  }
  ngOnInit() {
    this.data.getCoinAndCodeName()
    this.getTabName()

  }

}
