import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service'
import { Router } from '@angular/router';

@Component({
  selector: 'challenge-Info',
  templateUrl: './challengeInfo.component.html',
  styleUrls: ['./challengeInfo.component.css']
})
export class challengeInfoComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private data: DataService,
    private routing: Router
  ) { }

  url = this.data.dataUrl;
  listReqURL = "_vti_bin/ListData.svc/"

  userScore: any = []
  transactions: any = []
  challengeDetail: any = {}
  eventDetail: any = {}


  updateChange(chanllenngeId: number, challenge: any) {
    let eventCode = (<HTMLInputElement>document.getElementById('eventCode')).value
    this.eventDetail.Title = (<HTMLInputElement>document.getElementById('eventName')).value
    this.eventDetail.Description = (<HTMLInputElement>document.getElementById('eventDescription')).value
    this.eventDetail.EventCode = (<HTMLInputElement>document.getElementById('eventCode')).value
    this.eventDetail.Score = (<HTMLInputElement>document.getElementById('codeEarning')).value
    this.eventDetail.RegisterLink = (<HTMLInputElement>document.getElementById('eventUrl')).value
    this.eventDetail.CodeLimit = parseInt((<HTMLInputElement>document.getElementById('codeLimit')).value)
    this.http.get<any>(this.url + this.listReqURL + "ChallengesDetail" + "/?$filter=(EventCode eq '" + eventCode + "')"
      , { withCredentials: true }
    ).subscribe(dataCode => {
      if (dataCode.d.results.length == 0 || this.challengeDetail.value.EventCode == eventCode) {
        this.http.post(this.url + this.listReqURL + "ChallengesDetail(" + chanllenngeId.toString() + ")",
          JSON.stringify(this.eventDetail)
          , {
            headers: {
              'X-HTTP-Method': 'MERGE',
              'If-Match': challenge.value.__metadata.etag
            }, withCredentials: true
          }
        ).subscribe(data1 => {
          alert("Submit change successful")
          window.location.replace(this.data.urlLocation)
        })
      }
      else {
        alert("Duplicate Event code error")
      }
    })


  }
  return() {
    this.routing.navigate(['/Landing-site'])

}

  ngOnInit() {
    this.data.currenttempTransaction.subscribe(message => {
      this.transactions = message
      

    })
    this.data.currentChallengeDetail.subscribe(message => {
      this.challengeDetail = message;
      (<HTMLInputElement>document.getElementById('eventName')).value = this.challengeDetail.value.Title;
      (<HTMLInputElement>document.getElementById('eventDescription')).value = this.challengeDetail.value.Description;
      (<HTMLInputElement>document.getElementById('codeLimit')).value = this.challengeDetail.value.CodeLimit.toString();
      (<HTMLInputElement>document.getElementById('eventCode')).value = this.challengeDetail.value.EventCode;
      (<HTMLInputElement>document.getElementById('codeEarning')).value = this.challengeDetail.value.Score;
      (<HTMLInputElement>document.getElementById('eventUrl')).value = this.challengeDetail.value.RegisterLink;


    })


  }

}