import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service'
import { Router } from '@angular/router';
import { Alert } from 'selenium-webdriver';

@Component({
    selector: 'challenge-Form',
    templateUrl: './challengeForm.component.html',
    styleUrls: ['./challengeForm.component.css']
})
export class ChallengeFormComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private data: DataService,
        private routing: Router
    ) { }
    eventDetail = { Title: "", Description: "", EventCode: "", Score: "", RegisterLink: "", Active: "Disable", CodeLimit: 0, Picture: "defaultEvent.png", Display: "Hide", EventDate: new Date() }
    publicEvent?: any;
    url = this.data.dataUrl;
    listReqURL = "_vti_bin/ListData.svc/"

    submit() {

        let eventCode = (<HTMLInputElement>document.getElementById('eventCode')).value
        this.eventDetail.Title = (<HTMLInputElement>document.getElementById('eventName')).value
        this.eventDetail.Description = (<HTMLInputElement>document.getElementById('eventDescription')).value
        this.eventDetail.EventCode = (<HTMLInputElement>document.getElementById('eventCode')).value
        this.eventDetail.Score = (<HTMLInputElement>document.getElementById('codeEarning')).value
        this.eventDetail.RegisterLink = (<HTMLInputElement>document.getElementById('eventUrl')).value
        this.eventDetail.CodeLimit = parseInt((<HTMLInputElement>document.getElementById('codeLimit')).value)
        this.eventDetail.EventDate = new Date(new Date((<HTMLInputElement>document.getElementById('eventDate')).value).getTime() + (24000 * 60 * 60))
        let temp_date = new Date(new Date((<HTMLInputElement>document.getElementById('eventDate')).value).getTime() + (24000 * 60 * 60)).toString()
        // alert(eventCode.length && this.eventDetail.Title.length && this.eventDetail.Description.length && temp_date.length && this.eventDetail.RegisterLink.length && this.eventDetail.CodeLimit && this.eventDetail.EventCode.length) 
        if ((eventCode.length && this.eventDetail.Title.length && this.eventDetail.Description.length && temp_date.length && this.eventDetail.CodeLimit && this.eventDetail.EventCode.length) == 0) {
            alert('you missed some fill')
        }
        else {
            this.http.get<any>(this.url + this.listReqURL + "ChallengesDetail" + "/?$filter=(EventCode eq '" + eventCode + "')"
                , { withCredentials: true }
            ).subscribe(dataCode => {
                if (dataCode.d.results.length == 0) {
                    // alert(this.eventDetail.EventDate)
                    this.http.post(this.url + this.listReqURL + "ChallengesDetail",
                        JSON.stringify(this.eventDetail)
                        , { withCredentials: true }
                    ).subscribe(data1 => {
                        // this.publicEvent = this.eventDetail;
                        // delete this.publicEvent.EventCode;
                        // this.http.post(this.url + this.listReqURL + "ChallengesDetailsPublic",
                        //     JSON.stringify(this.publicEvent)
                        //     , { withCredentials: true }
                        // ).subscribe(dataCode2 => { })
                        alert("Submit successful")
                        this.routing.navigate(['/Landing-site'])

                    })
                }
                else {
                    alert("Duplicate error")
                }
            })
        }




    }

    return() {
        this.routing.navigate(['/Landing-site'])

    }
    ngOnInit() {


    }

}