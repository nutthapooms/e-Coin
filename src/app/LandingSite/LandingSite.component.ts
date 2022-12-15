import { Component, OnInit, HostListener, NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay } from 'q';
import { DataService } from '../data.service';
import { NONE_TYPE, ThrowStmt } from '@angular/compiler';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';

// import { getUserFunction } from '../shared/getUser.component';
@Component({
    selector: 'Landing-Site',
    templateUrl: './LandingSite.component.html',
    styleUrls: ['./LandingSite.component.css']
})

export class LandingSiteComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private routing: Router,
        private location: Location,
        public data: DataService
        // private userFx: getUserFunction,
    ) {

    }
    Challenges: any[] = []
    ChallengesAdmin: any[] = []
    Banner: any[] = []

    // url = this.data.dataUrl;
    listReqURL = "_vti_bin/ListData.svc/"
    transactionInfo = { EventOrPrice: "", Operation: "", Amount: 1 }
    userUpdate = { Name: "Update", Score: 0 }
    userScore: any = []
    userProfile: any = {}
    adminCheck = false
    imagePath = ""
    imageCoinPath = ""
    coinImagePath = ""
    firstBanner = ""
    secondsCumulative = 1
    newYearDate = new Date('December 30, 2022 23:00:00').getTime()
    currentDate = new Date().getTime()
    time = this.newYearDate - this.currentDate
    timeString = ""
    days = 0
    hours = 0
    minutes = 0
    seconds = 0

    // CodeName = ""
    // CoinsName = ""

    // updateCoinCodeName() {
    //     this.data.currentCoinsName.subscribe(data => {
    //         this.CoinsName = data;
    //     })
    //     this.data.currentCodeName.subscribe(data => {
    //         this.CodeName = data;
    //     })

    // }


    // loading: boolean = false

    slidePosition = 1;
    countDown() {

        this.secondsCumulative += 1
        // console.log(this.secondsCumulative)


        // alert(this.newYearDate.getTime()- currentTime.getTime())
        this.time = this.time - 1000
        this.days = Math.floor(this.time / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((this.time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((this.time % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((this.time % (1000 * 60)) / 1000);

        this.timeString =this.days + " " + this.hours + " : " + this.minutes + " : " + this.seconds;
    }

    getTabName() {
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "SiteDetails", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            this.imagePath = this.data.dataUrl + "Picture%20Hub/" + data.d.results[0].Picture
            this.coinImagePath = this.data.dataUrl + "Picture%20Hub/" + data.d.results[7].Picture
            this.imageCoinPath = this.data.dataUrl + "Picture%20Hub/" + data.d.results[8].Picture
            this.firstBanner = this.data.dataUrl + "Picture%20Hub/" + data.d.results[9].Picture
            document.getElementById('countDownBanner')?.style.setProperty('background-image', 'url('+this.data.dataUrl + "Picture%20Hub/" + 'emcoin_countdown.png)')
            document.getElementById('countdownCounter')?.style.setProperty('background-image', 'url('+this.data.dataUrl + "Picture%20Hub/" + 'countdownComponent1.png)')

            

        })
    }

    plusSlides(n: number) {
        this.SlideShow(this.slidePosition += n);
    }

    currentSlide(n: number) {
        this.SlideShow(this.slidePosition = n);
    }

    SlideShow(n: number) {
        let i: number;
        let slides = <any>document.getElementsByClassName("Containers");
        let circles = <any>document.getElementsByClassName("dots");
        if (n > slides.length) { this.slidePosition = 1 }
        if (n < 1) { this.slidePosition = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < circles.length; i++) {
            circles[i].className = circles[i].className.replace(" enable", "");
        }
        slides[this.slidePosition - 1].style.display = "block";
        circles[this.slidePosition - 1].className += " enable";
    }

    getBannerDetail() {
        this.data.loading = true
        this.Banner = []
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "Banner", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            this.data.loading = false

            for (let index in data.d.results) {

                this.Banner.push({ value: data.d.results[index], PictureUrl: this.data.dataUrl + "Picture%20Hub/" + data.d.results[index].Picture });

            };

        })
    }

    getBoothDetail() {
        this.data.loading = true
        this.Challenges = []
        let AllEventBtn = <any>document.getElementById('AllEventsBtn');
        let UpcomingEventBtn = <any>document.getElementById('UpcomingBtn');
        UpcomingEventBtn.style.cssText = 'border-bottom : hidden;'
        AllEventBtn.style.cssText = 'border-bottom : 2px solid currentColor; border-radius: 0px;'
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "ChallengesDetailsPublic" + "/?$filter=(Active ne 'Disable' and Display ne 'Hide')&$orderby=EventDate%20desc", {
            // this.http.get<any>(this.data.dataUrl + this.listReqURL + "ChallengesDetail" + "/?$filter=(Active ne 'Disable')", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            this.data.loading = false

            for (let index in data.d.results) {

                let EventDate = data.d.results[index].EventDate.replace('/Date(', '')
                data.d.results[index].EventDate = new Date(parseInt(EventDate.replace(')/', ''))).toDateString();
                // if (new Date() < new Date(parseInt(EventDate.replace(')/', '')))) {
                this.Challenges.push({ value: data.d.results[index], PictureUrl: this.data.dataUrl + "Picture%20Hub/" + data.d.results[index].Picture });

                // }
            }

        })
    }
    getPastBoothDetail() {
        this.data.loading = true
        this.Challenges = []
        let AllEventBtn = <any>document.getElementById('AllEventsBtn');
        let UpcomingEventBtn = <any>document.getElementById('UpcomingBtn');
        // UpcomingEventBtn.style.cssText = 'border-bottom : 2px solid currentColor; border-radius: 0px;'
        // AllEventBtn.style.cssText = 'border-bottom : hidden;'
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "ChallengesDetailsPublic" + "/?$filter=(Active ne 'Disable' and Display ne 'Hide')", {
            // this.http.get<any>(this.data.dataUrl + this.listReqURL + "ChallengesDetail" + "/?$filter=(Active ne 'Disable')", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            this.data.loading = false

            for (let index in data.d.results) {

                let EventDate = data.d.results[index].EventDate.replace('/Date(', '')
                data.d.results[index].EventDate = new Date(parseInt(EventDate.replace(')/', ''))).toDateString();
                if (new Date() > new Date(parseInt(EventDate.replace(')/', '')))) {
                    this.Challenges.push({ value: data.d.results[index], PictureUrl: this.data.dataUrl + "Picture%20Hub/" + data.d.results[index].Picture });

                }
            }

        })
    }
    getFutureBoothDetail() {
        this.data.loading = true
        this.Challenges = []
        let AllEventBtn = <any>document.getElementById('AllEventsBtn');
        let UpcomingEventBtn = <any>document.getElementById('UpcomingBtn');
        UpcomingEventBtn.style.cssText = 'border-bottom : 2px solid currentColor; border-radius: 0px;'
        AllEventBtn.style.cssText = 'border-bottom : hidden;'
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "ChallengesDetailsPublic" + "/?$filter=(Active ne 'Disable' and Display ne 'Hide')&$orderby=EventDate%20desc", {
            // this.http.get<any>(this.data.dataUrl + this.listReqURL + "ChallengesDetail" + "/?$filter=(Active ne 'Disable')", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            this.data.loading = false
            let tempDate = new Date()
            tempDate.setDate(new Date().getDate() - 7)

            for (let index in data.d.results) {

                let EventDate = data.d.results[index].EventDate.replace('/Date(', '')
                data.d.results[index].EventDate = new Date(parseInt(EventDate.replace(')/', ''))).toDateString();
                if (tempDate < new Date(parseInt(EventDate.replace(')/', '')))) {
                    this.Challenges.push({ value: data.d.results[index], PictureUrl: this.data.dataUrl + "Picture%20Hub/" + data.d.results[index].Picture });

                }
            }

        })
    }
    getBoothDetailAdmin() {
        this.data.loadingMSG = "Loading Challenges"
        this.data.loading = true

        // alert("test")
        this.data.currentUserName.subscribe(message => {
            this.userProfile = message
            this.data.userProfile = message
        })
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "ChallengesDetail" + "/?$filter=(CreatedBy/WorkEmail eq '" + this.userProfile.Email + "')", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            if (data.d.results.length > 0) {
                this.adminCheck = true
                for (let index in data.d.results) {
                    data.d.results[index].EventCode = data.d.results[index].EventCode;
                    // data.d.results[index].EventCode = this.data.decryptUsingAES256(data.d.results[index].EventCode);
                    this.ChallengesAdmin.push({ value: data.d.results[index], PictureUrl: this.data.dataUrl + "Picture%20Hub/" + data.d.results[index].Picture });
                }
            }
            this.data.loadingMSG = "Loading"
            this.data.loading = false

        })
    }

    registerLink(link: string) {
        window.open(link, '_blank')
    }

    getDetail(challengesdetail: any) {
        // console.log(challengesdetail)
        this.data.changeChallengeDetail(challengesdetail);
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "Transaction" + "/?$filter=(EventOrPrice eq '" + challengesdetail.value.EventCode + "')",
            {
                withCredentials: true
            }).subscribe(data => {
                let keys: any[] = [];
                for (let key in data.d.results) {
                    let createdDate = data.d.results[key].Created.replace('/Date(', '')
                    data.d.results[key].Created = new Date(parseInt(createdDate.replace(')/', ''))).toString()
                    data.d.results[key].EventCode = data.d.results[key].EventCode;
                    // data.d.results[key].EventCode = this.data.decryptUsingAES256(data.d.results[key].EventCode);
                    this.http.get<any>(this.data.dataUrl + "_api/web/getuserbyid(" + data.d.results[key].CreatedById + ")", {
                        responseType: 'json', withCredentials: true
                    }).subscribe(data2 => {
                        keys.push({ value: data.d.results[key], creator2: data2.d.Title })
                    })
                }
                this.data.changeTempTransaction(keys)
                this.routing.navigate(['/challenge-Info'])
            })
    }
    disableEvent(challengesDel: any) {
        this.http.post(this.data.dataUrl + this.listReqURL + "ChallengesDetail(" + challengesDel.value.Id + ")",
            { Active: "Disable" },
            {
                headers: {
                    'X-HTTP-Method': 'MERGE',
                    'If-Match': challengesDel.value.__metadata.etag
                }
            }).subscribe(result => {
                // alert("Disable Success")
                this.data.confirmationMessage = "Disable Success";
                this.data.openAlert()


            })
    }
    enableEvent(challengesDel: any) {
        this.http.post(this.data.dataUrl + this.listReqURL + "ChallengesDetail(" + challengesDel.value.Id + ")",
            { Active: "Enable" },
            {
                headers: {
                    'X-HTTP-Method': 'MERGE',
                    'If-Match': challengesDel.value.__metadata.etag
                }
            }).subscribe(result => {
                // alert("Enable Success")
                this.data.confirmationMessage = "Enable Success";
                this.data.openAlert()


                // window.location.replace(this.data.urlLocation)

                // console.log("redeem success")
            })
    }

    HideEvent(challengesDel: any) {
        this.http.post(this.data.dataUrl + this.listReqURL + "ChallengesDetail(" + challengesDel.value.Id + ")",
            { Display: "Hide" },
            {
                headers: {
                    'X-HTTP-Method': 'MERGE',
                    'If-Match': challengesDel.value.__metadata.etag
                }
            }).subscribe(result => {
                // alert("Disable Success")
                this.data.confirmationMessage = "Hide Success";
                this.data.openAlert()


            })
    }
    UnhideEvent(challengesDel: any) {
        this.http.post(this.data.dataUrl + this.listReqURL + "ChallengesDetail(" + challengesDel.value.Id + ")",
            { Display: "Unhide" },
            {
                headers: {
                    'X-HTTP-Method': 'MERGE',
                    'If-Match': challengesDel.value.__metadata.etag
                }
            }).subscribe(result => {
                // alert("Enable Success")
                this.data.confirmationMessage = "Unhide Success";
                this.data.openAlert()


                // window.location.replace(this.data.urlLocation)

                // console.log("redeem success")
            })
    }

    _arrayBufferToBase64(buffer: any) {
        var binary = ''
        var bytes = new Uint8Array(buffer)
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return binary;
    }


    uploadfile() {
        this.routing.navigate(['/Challenge-Form'])


    }



    // forward/Back controls


    ngOnInit() {
        this.countDown()
        // this.getFutureBoothDetail()
        this.getBoothDetail()
        setInterval(() => {
            this.countDown()
        }, 1000)
        // this.updateCoinCodeName()
        this.getTabName()
        this.getBannerDetail()

        this.data.currentUserScore.subscribe(message => {
            this.userScore = message
            if (this.userScore[0].value.Role == 'Admin') {
                this.adminCheck = true
                setTimeout(() => {
                    this.getBoothDetailAdmin()
                }, 2000)

            }
        })
        setTimeout(() => {
            this.SlideShow(1)
        }, 200)


    }
    currentLocation() {
        return this.location.path()
    }

}

