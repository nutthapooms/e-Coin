import { Component, OnInit, HostListener, NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

import { delay } from 'q';
import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
@Component({
    selector: 'Quiz',
    templateUrl: './Quiz.component.html',
    styleUrls: ['./Quiz.component.css']
})

export class QuizComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private router: Router,
        private location: Location,
        public data: DataService
    ) {

    }
    leaderBoard: any[] = []
    // data.dataUrl = this.data.dataUrl;
    listReqURL = "_vti_bin/ListData.svc/"
    myRank = -1
    userScore: any = []
    HowTo_Array = ['Code', 'Coin', 'Reward', 'LuckyDraw']
    Quizes: any = []
    CurrentQuiz: any = {}
    QuizTracker = ""
    Answer = ""




    imagePathArr: any[] = []


    imagePath = this.data.dataUrl + "Picture%20Hub/"
    QuizimagePath = this.data.dataUrl + "Picture%20Hub/"
    eCode_img = this.data.dataUrl + "Picture%20Hub/eCode.svg"

    HowToIndicator = 1
    QuizTransactionInfo = { QuizNo: "", Answer: "" ,OldStatus:""}


    loading = true

    waitTilComplete(url: string) {
        this.http.get<any>(url).subscribe(data => {
            if (data.d.NewStatus == "1") {
                this.data.openAlert()
                this.data.loadingMSG = "Loading"
                this.data.getUserScore()
                this.data.loading = false
                this.data.confirmationMessage = "Correct!"
                
            }
            else if (data.d.NewStatus == null) {
                delay(200);
                this.waitTilComplete(url)
                
            }
            else if (data.d.NewStatus == "2") {
                this.data.loading = false
                this.data.getUserScore()
                this.data.confirmationMessage = "Wrong"
                this.data.openAlert();

            }
            else if (data.d.Status == '0') {
                this.data.loading = false
                this.data.confirmationMessage = "Error, please contact EMCoin team";
                this.data.openAlert();
            }
        })
    }
    SubmitAnswer() {
        // let eventCode = this.encryptUsingAES256((<HTMLInputElement>document.getElementById('EventCodeInput')).value);
        // this.transactionInfo.EventOrPrice = this.encryptUsingAES256((<HTMLInputElement>document.getElementById('EventCodeInput')).value + "" + "2M2Edsin6u8eqlqM");
        this.QuizTransactionInfo.QuizNo = this.CurrentQuiz.QuizNo
        this.QuizTransactionInfo.Answer = this.Answer
        this.QuizTransactionInfo.OldStatus = this.reverseString(this.QuizTracker)

        //check for code existent
        this.http.post<any>(this.data.url + this.data.listReqURL + "QuizTracker",
            JSON.stringify(this.QuizTransactionInfo)
            , { withCredentials: true }
        ).subscribe(dataPost => {
            this.data.loading = true
            this.data.loadingMSG = "Finalizing your transaction. This could take a moment."
            this.waitTilComplete(dataPost.d.__metadata.uri)

        })

    }
    AnswerInput(answer: string) {
        this.Answer = answer
    }
    testInput() {
        this.data.confirmationMessage = "Your answer is: "+this.Answer;
        this.data.openAlert();
        this.SubmitAnswer();
        this.closeQuiz()
    }
    getTabName() {
        this.http.get<any>(this.data.dataUrl + this.listReqURL + "SiteDetails", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            this.imagePath = this.data.dataUrl + "Picture%20Hub/" + data.d.results[8].Picture
        })
    }
    getQuizes() {
        this.http.get<any>(this.data.dataUrl + this.data.listReqURL + "QuizPublic", {
            responseType: 'json',
            withCredentials: true
        }).subscribe(data => {
            this.Quizes = data.d.results
        })
    }

    changeHowto(indicator: number) {
        this.HowTo_Array.forEach(element => {
            let temp_howto = <any>document.getElementById(element);
            temp_howto.style.cssText = 'color: rgb(187, 131, 120);background-color: white;'
        });
        let current_howto = <any>document.getElementById(this.HowTo_Array[indicator - 1])
        current_howto.style.cssText = 'background-color: rgb(187, 131, 120);color: rgb(255, 235, 231);'

        this.HowToIndicator = indicator
    }
    reverseString(str: string) {

        // empty string
        let newString = "";
        for (let i = str.length - 1; i >= 0; i--) {
            newString += str[i];
        }
        return newString;
    }
    closeQuiz() {
        <HTMLInputElement><unknown>document.getElementById('QuizBlog')?.classList.add("em-is-closed")
    }



    openQuiz(Quiz: any) {
        <HTMLInputElement><unknown>document.getElementById('QuizBlog')?.classList.remove("em-is-closed")
        this.CurrentQuiz = Quiz
    }
    checkDone(QuizTracker: string, i: number) {
        if (QuizTracker.substring(i, i + 1) != '0' && QuizTracker.substring(i, i + 1) != '') {
            return true
        }
        else {
            return false
        }
    }

    ngOnInit() {
        // alert(this.data.userScore[0].value.QuizTracker)
        this.data.getUserScore()
        this.QuizTracker = this.reverseString(this.data.userScore[0].value.QuizTracker.toString())
        this.getQuizes()
        this.getTabName()
        let current_howto = <any>document.getElementById('Code')
        // current_howto.style.cssText = 'background-color: rgb(187, 131, 120);color: rgb(255, 235, 231);'

        this.data.currentUserScore.subscribe(message => {
            this.userScore = message
        })
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

