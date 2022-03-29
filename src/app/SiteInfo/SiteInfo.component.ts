import { Component, OnInit, HostListener, NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

import { delay } from 'q';
import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';
@Component({
    selector: 'Site-Info',
    templateUrl: './SiteInfo.component.html',
    styleUrls: ['./SiteInfo.component.css']
})

export class SiteInfoComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private router: Router,
        private location: Location,
        private data: DataService
    ) {

    }
    leaderBoard: any[] = []
    // data.dataUrl = this.data.dataUrl;
    listReqURL = "_vti_bin/ListData.svc/"
    myRank = -1
    userScore: any = []
    HowTo_Array = ['Code','Coin','Reward','LuckyDraw']
    

    GetToKnow = ""
    GetToKnowDesc = ""
    GetCodes = ""
    CollectCoins = ""
    RedeemRewards = ""
    EnterLD = ""
    HowtoCodes = ""
    HowtoCodesDesc = ""
    HowtoCoins =""
    HowtoCoinsDesc =""
    HowtoRewards = ""
    HowtoRewardsDesc = ""
    HowtoLuckyDraws =""
    HowtoLuckyDrawsDesc =""
    ContactUs =""
    ContactUsDesc =""
    imagePathArr :any[] = []


    imagePath = this.data.dataUrl + "Picture%20Hub/CoinGroup.svg"
    Vcoin_img = this.data.dataUrl + "Picture%20Hub/Vcoin.svg"
    eCode_img = this.data.dataUrl + "Picture%20Hub/eCode.svg"
    Gacha_img = this.data.dataUrl + "Picture%20Hub/Gacha.svg"
    Reward_img = this.data.dataUrl + "Picture%20Hub/Reward.svg"
    HowToIndicator = 1

    loading = true

    getTabName() {
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "SiteDetails", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            this.imagePath= this.data.dataUrl + "Picture%20Hub/" + data.d.results[8].Picture
        })
    }
    getAboutUs() {
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "AboutUs", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            let temp = []
            for (let key in data.d.results) {
                temp.push(data.d.results[key])
                // alert(this.data.dataUrl+"Picture%20Hub/"+data.d.results[key].Picture)
                this.imagePathArr.push(this.data.dataUrl+"Picture%20Hub/"+data.d.results[key].Picture)
              }
            // this.imagePathArr = temp
            this.GetToKnow = temp[0].Title
            this.GetToKnowDesc =temp[0].Description
            this.GetCodes =temp[1].Title
            this.CollectCoins = temp[2].Title
            this.RedeemRewards = temp[3].Title
            this.EnterLD =temp[4].Title
            this.HowtoCodes = temp[5].Title
            this.HowtoCodesDesc = temp[5].Description
            this.HowtoCoins = temp[6].Title
            this.HowtoCoinsDesc = temp[6].Description
            this.HowtoRewards = temp[7].Title
            this.HowtoRewardsDesc = temp[7].Description
            this.HowtoLuckyDraws = temp[8].Title
            this.HowtoLuckyDrawsDesc = temp[8].Description
            this.ContactUs = temp[9].Title
            this.ContactUsDesc = temp[9].Description

        })
    }
    

    ngOnInit() {
        this.getTabName()
        this.getAboutUs()
        let current_howto = <any>document.getElementById('Code')
        current_howto.style.cssText = 'background-color: rgb(187, 131, 120);color: rgb(255, 235, 231);'

        this.data.currentUserScore.subscribe(message => {
            this.userScore = message
          })
        // this.data.currentLeaderBoard.subscribe(message => this.leaderBoard = message)
        // this.data.currentMyRank.subscribe(message => {
        //     this.myRank = message;
        //     this.loading = false
        // })

    }
    changeHowto(indicator : number){
        this.HowTo_Array.forEach(element => {
            let temp_howto = <any>document.getElementById(element);
            temp_howto.style.cssText = 'color: rgb(187, 131, 120);background-color: white;'
        });
        let current_howto = <any>document.getElementById(this.HowTo_Array[indicator-1])
        current_howto.style.cssText = 'background-color: rgb(187, 131, 120);color: rgb(255, 235, 231);'

        this.HowToIndicator = indicator
    }
    currentLocation() {
        return this.location.path()
    }
}

