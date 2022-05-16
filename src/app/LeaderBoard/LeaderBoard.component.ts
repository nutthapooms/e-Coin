import { Component, OnInit, HostListener, NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

import { delay } from 'q';
@Component({
    selector: 'Leader-Board',
    templateUrl: './LeaderBoard.component.html',
    styleUrls: ['./LeaderBoard.component.css']
})

export class LeaderBoardComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private router: Router,
        private location: Location,
        public data: DataService
    ) {

    }
    nametemp = ["surname","firstname"]
    leaderBoard: any[] = []
    url = this.data.dataUrl;
    listReqURL = "_vti_bin/ListData.svc/"
    myRank = 0
    userScore: any = []

    imagePath = ""

    loading = true

    CodeName = ""
    CoinsName = ""

    updateCoinCodeName() {
        this.data.currentCoinsName.subscribe(data => {
            this.CoinsName = data;
        })
        this.data.currentCodeName.subscribe(data => {
            this.CodeName = data;
        })

    }
    nameCensor(name:string){
        name = name + ''
        let surname = name.substring(name.indexOf(',') + 1); 
       return name.charAt(0)+"****, "+name.substring(name.indexOf(',') + 2).charAt(0)+"****"
    }
    getTabName() {
        this.http.get<any>(this.url + this.listReqURL + "SiteDetails", {
          responseType: 'json'
          , withCredentials: true
        }).subscribe(data => {
          this.imagePath = this.url + "Picture%20Hub/" + data.d.results[4].Picture
        })
      }


    ngOnInit() {
        this.data.getLeaderBaord()
        this.updateCoinCodeName()
        this.data.currentUserScore.subscribe(message => {
            this.userScore = message
        })
        this.getTabName()
        // this.data.currentMyRank.subscribe(message => {
        //     this.myRank = message
        //   })
        // this.data.currentLeaderBoard.subscribe(message => this.leaderBoard = message)
        // this.data.currentMyRank.subscribe(message => {
        //     this.myRank = message;
        //     this.loading = false
        // })

    }
    currentLocation() {
        return this.location.path()
    }
}

