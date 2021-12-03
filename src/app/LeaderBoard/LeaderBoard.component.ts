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
    leaderBoard: any[] = []
    url = this.data.dataUrl;
    listReqURL = "_vti_bin/ListData.svc/"
    myRank = -1
    userScore: any = []

    imagePath = this.data.dataUrl + "Picture%20Hub/Winners-pana.svg"

    loading = true

    CodeName = ""
    CoinsName = ""

    updateCoinCodeName(){
        this.data.currentCoinsName.subscribe(data =>{
            this.CoinsName = data;
        })
        this.data.currentCodeName.subscribe(data =>{
            this.CodeName = data;
        })
        
    }
    

    ngOnInit() {
        this.updateCoinCodeName()
        this.data.currentUserScore.subscribe(message => {
            this.userScore = message
          })
        this.data.currentLeaderBoard.subscribe(message => this.leaderBoard = message)
        this.data.currentMyRank.subscribe(message => {
            this.myRank = message;
            this.loading = false
        })

    }
    currentLocation() {
        return this.location.path()
    }
}

