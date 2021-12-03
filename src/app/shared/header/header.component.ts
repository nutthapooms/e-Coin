import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { DataService } from 'src/app/data.service'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public data: DataService,
    private routing: Router

  ) {
    this.routing.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // this.getLeaderBaord()
        this.getUser()
        // this.getUserScore()

      }
    });
  }

  url = this.data.dataUrl;
  imagePath = this.data.dataUrl + "Picture%20Hub/Esso%20Club%20logo-White.png"
  listReqURL = "_vti_bin/ListData.svc/"
  transactionInfo = { EventOrPrice: "", Operation: "" }
  leaderBoard: any[] = []
  Challenges: any[] = []
  userProfile: any = {}
  userScore: any = []
  TabName: any[] = []
  tooLong = 0

  // loadingMSG = "Loading"
  // loading: boolean = false
  // confirmationMessage = ""



  getCoinAndCodeName() {
    this.http.get<any>(this.url + this.listReqURL + "SiteDetails", {
      responseType: 'json'
      , withCredentials: true
    }).subscribe(data => {
      console.log(data)
      for (let key in data.d.results) {
        this.TabName.push(data.d.results[key])
        // this.data.changeCodeName('Code');
        // this.data.changeCoinsName(data.d.re);

      }
      this.data.changeCodeName(this.TabName[11].Title);
      this.data.changeCoinsName(this.TabName[10].Title);
    })
  }

  getTabName() {
    this.http.get<any>(this.url + this.listReqURL + "SiteDetails", {
      responseType: 'json'
      , withCredentials: true
    }).subscribe(data => {
      console.log(data)
      for (let key in data.d.results) {
        this.TabName.push(data.d.results[key])
      }
    })
  }

  getUser() {
    (<HTMLInputElement>document.getElementById('ProfileImage')).src = this.data.dataUrl + "Picture%20Hub/defaultProfileImage.png"

    this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
      responseType: 'json'
      , withCredentials: true
    }).subscribe(data => {
      // console.log(data.d)



      this.data.changeUser(data.d); //update userprofile
      this.userProfile = data.d;
      this.data.userProfile = data.d;

      try {
        if (this.userProfile.PictureUrl != null) {
          this.http.get<any>(this.userProfile.PictureUrl, { withCredentials: true }).subscribe(data2 => {
            // this.http.get<any>(data.d.PictureUrl, { withCredentials: true }).subscribe(data2 => {
            (<HTMLInputElement>document.getElementById('ProfileImage')).src = data.d.PictureUrl;
          }, (error) => {
            console.log('there is an error:' + error.status);
            if (error.status == '404') {
              (<HTMLInputElement>document.getElementById('ProfileImage')).src = this.data.dataUrl + "Picture%20Hub/defaultProfileImage.png"

            }
            else {
              (<HTMLInputElement>document.getElementById('ProfileImage')).src = data.d.PictureUrl;

            }
          })
        }
        else {
          (<HTMLInputElement>document.getElementById('ProfileImage')).src = this.data.dataUrl + "Picture%20Hub/defaultProfileImage.png"

        }
      }
      catch (e) {
        (<HTMLInputElement>document.getElementById('ProfileImage')).src = this.data.dataUrl + "Picture%20Hub/defaultProfileImage.png"

      }


    })
  }
  predicateBy(prop: string, indicator: string) {
    return function (a: any, b: any) {
      if (a[prop][indicator] > b[prop][indicator]) {
        return -1;
      } else if (a[prop][indicator] < b[prop][indicator]) {
        return 1;
      }
      return 0;
    }
  }
  contactUs(name: string) {
    alert(name)
  }
  groupby(array: any[], key: string) {
    let finalresult: any = []
    let unitArr: any = []
    let existingArr: string[] = []
    let index = 0
    array.reduce((result, currentValue) => {
      if (existingArr.find(element => element == currentValue[key]) == currentValue[key]) {
        result = currentValue
        finalresult[finalresult.findIndex((item: { [x: string]: any; EventOrPrice: any; }) => item.EventOrPrice === currentValue[key])].Unit += 1

      }
      else {
        unitArr[index] = 1

        result = currentValue
        finalresult.push({ EventOrPrice: currentValue[key], Unit: 1 })
        existingArr.push(currentValue[key])
        index += 1
      }
      return result
    }, {});

    return finalresult
  };
  closeHowTo() {
    <HTMLInputElement><unknown>document.getElementById('HowToModal')?.classList.add("em-is-closed")
  }
  openHowTo() {
    <HTMLInputElement><unknown>document.getElementById('HowToModal')?.classList.remove("em-is-closed")
  }
  getUserTransaction() {
    this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
      responseType: 'json', withCredentials: true
    }).subscribe(data1 => {
      this.http.get<any>(this.url + this.listReqURL + "Transaction" + "/?$filter=(CreatedBy/WorkEmail eq '" + data1.d.Email + "' and EventOrPrice ne 'create user')", {
        responseType: 'json'
        // , withCredentials: true
      }).subscribe(data => {
        let keys: any[] = [];
        let keys2: any[] = [];

        for (let key in data.d.results) {
          let CreateDate = data.d.results[key].Created.replace('/Date(', '')
          data.d.results[key].Created = new Date(parseInt(CreateDate.replace(')/', ''))).toString()
          if (data.d.results[key].Operation == 'reduction') {
            keys.push(data.d.results[key])

          }
          if (data.d.results[key].Operation == 'earn') {
            keys2.push(data.d.results[key])
          }
        }
        this.data.changeMyTransactionHistory(keys2);
        let transactionGroupbyItem = this.groupby(keys, 'EventOrPrice')
        this.data.changeMyTransaction(transactionGroupbyItem); //update Transaction
      })
    })
  }
 
  closeAlert() {
    <HTMLInputElement><unknown>document.getElementById('Alert_header')?.classList.add("em-is-closed")
  }
  reloadPage() {
    window.location.reload()
  }


  
  getLeaderBaord() {
    let keys: { value: any; creator2: string; }[] = [];
    let indexer = []
    this.http.get<any>(this.url + this.listReqURL + "ContactDetails", {
      responseType: 'json', withCredentials: true
    }).subscribe(data => {
      this.getUser()
      let index = 0
      for (let key in data.d.results) {

        this.http.get<any>(this.url + "_api/web/getuserbyid(" + data.d.results[key].CreatedById + ")", {
          responseType: 'json'
          , withCredentials: true
        }).subscribe(data2 => {
          keys.push({ value: data.d.results[key], creator2: data2.d.Title })
          keys.sort(this.predicateBy("value", "Score"))

          if (parseInt(key) + 1 == data.d.results.length) {
            this.data.changeMyRank(keys.findIndex(item => item.value.Name === this.userProfile.DisplayName))
            this.data.changeLeaderBoard(keys)
          }

        })

      }
    })
  }


  ngOnInit() {
    this.userScore = this.data.getUserScore()
    this.getTabName()
    this.getCoinAndCodeName()
    this.getUser()
  }

}