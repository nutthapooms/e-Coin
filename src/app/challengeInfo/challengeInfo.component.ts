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
  publicEvent?: any
  nrSelect: any

  updateChange(chanllenngeId: number, challenge: any) {
    let eventCode = (<HTMLInputElement>document.getElementById('eventCode')).value
    this.eventDetail.Title = (<HTMLInputElement>document.getElementById('eventName')).value
    this.eventDetail.Description = (<HTMLInputElement>document.getElementById('eventDescription')).value
    this.eventDetail.EventCode = (<HTMLInputElement>document.getElementById('eventCode')).value;
    this.eventDetail.Score = (<HTMLInputElement>document.getElementById('codeEarning')).value
    this.eventDetail.RegisterLink = (<HTMLInputElement>document.getElementById('eventUrl')).value
    this.eventDetail.CodeLimit = parseInt((<HTMLInputElement>document.getElementById('codeLimit')).value)
    this.eventDetail.RequestedBy = (<HTMLInputElement>document.getElementById('eventBy')).value
    this.eventDetail.EventDate = new Date(new Date((<HTMLInputElement>document.getElementById('eventDate')).value).getTime() + (24000 * 60 * 60))
    // this.eventDetail.EventDate = new Date(new Date((<HTMLInputElement>document.getElementById('eventDate')).value).getTime() + (71000 * 60 * 60))    
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
          // this.publicEvent = this.eventDetail;
          // delete this.publicEvent.EventCode;
          // this.http.post(this.url + this.listReqURL + "ChallengesDetailsPublic",
          //   JSON.stringify(this.publicEvent)
          //   , {
          //     headers: {
          //       'X-HTTP-Method': 'MERGE',
          //       'If-Match': challenge.value.__metadata.etag
          //     }, withCredentials: true
          //   }
          // ).subscribe(dataCode2 => { })
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
      let EventDateTemp = this.challengeDetail.value.EventDate.replace('/Date(', '')
      let EventDate = new Date(parseInt(EventDateTemp.replace(')/', ''))).toLocaleDateString();
      EventDate = EventDate.replace('/', '-');
      EventDate = EventDate.replace('/', '-');
      EventDate = EventDate.replace(/[^ -~]/g, '');
      EventDate = EventDate.replace(/[^ -~]/g, '');
      // EventDate = EventDate.replace('/','-');
      (<HTMLInputElement>document.getElementById('eventName')).value = this.challengeDetail.value.Title;
      (<HTMLInputElement>document.getElementById('eventDescription')).value = this.challengeDetail.value.Description;
      (<HTMLInputElement>document.getElementById('codeLimit')).value = this.challengeDetail.value.CodeLimit.toString();
      // (<HTMLInputElement>document.getElementById('eventCode')).value = this.challengeDetail.value.EventCode;
      (<HTMLInputElement>document.getElementById('eventCode')).value = this.challengeDetail.value.EventCode;
      (<HTMLInputElement>document.getElementById('codeEarning')).value = this.challengeDetail.value.Score;
      (<HTMLInputElement>document.getElementById('eventUrl')).value = this.challengeDetail.value.RegisterLink;
      // (<HTMLInputElement>document.getElementById('eventBy')).value = this.challengeDetail.value.RequestedBy;
      this.nrSelect = this.challengeDetail.value.RequestedBy;
      alert(this.challengeDetail.value.RequestedBy);
      (<HTMLInputElement>document.getElementById('eventDate')).value = EventDate;


    })


  }

}