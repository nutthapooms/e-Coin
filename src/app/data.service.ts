// This file content all of function that will use accross all pages.
// dataUrl will indicate site data url
// urlLocation will indicate where the index.html file located.

//git test

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
// import { url } from 'inspector'

@Injectable()
export class DataService {
    public dataUrl = 'https://ishareteam5.na.xom.com/sites/thvision/emcoin/'
    // public dataUrl = 'https://ishareteam4.na.xom.com/sites/THAAreaOps/CusEng/ITFairOnline2/emcoin/'
    // public dataUrl = 'https://ishareteam2.na.xom.com/sites/CHEMGMO18/WAEM/vcoin/ITFairOnline2/'

    // public urlLocation = 'http://localhost:4200';
    public urlLocation = 'https://ishareteam5.na.xom.com/sites/thvision/emcoin/package/Code/index.html';
    // public urlLocation = 'https://ishareteam4.na.xom.com/sites/THAAreaOps/CusEng/ITFairOnline2/emcoin/package/Code/index.html';
    // public urlLocation = 'https://ishareteam2.na.xom.com/sites/CHEMGMO18/WAEM/vcoin/ITFairOnline2/package/Code/index.html';


    private returnLocation = new BehaviorSubject('/Landing-site');
    currentReturnLocation = this.returnLocation.asObservable();

    private UserName = new BehaviorSubject({});
    currentUserName = this.UserName.asObservable();

    private UserScore = new BehaviorSubject([{ value: { Score: 0 } }]);
    currentUserScore = this.UserScore.asObservable();

    // public LeaderBoard = [{ Name: <any>{}, Score: <any>{} }];
    public LeaderBoard = [{ Name: <any>{}, EarnedScore: <any>{} }];
    // currentLeaderBoard = this.LeaderBoard.asObservable();

    private langSource = new BehaviorSubject('eng');
    currentLanguage = this.langSource.asObservable();

    public myRank = 0
    // currentMyRank = this.myRank.asObservable();

    private myTransaction = new BehaviorSubject([""]);
    currentMyTransaction = this.myTransaction.asObservable();

    private myTransactionHistory = new BehaviorSubject([""]);
    currentMyTransactionHistory = this.myTransactionHistory.asObservable();

    private myTransactionHistoryOld = new BehaviorSubject([""]);
    currentMyTransactionHistoryOld = this.myTransactionHistoryOld.asObservable();

    private tempTransaction = new BehaviorSubject([""]);
    currenttempTransaction = this.tempTransaction.asObservable();

    private challengeDetail = new BehaviorSubject({});
    currentChallengeDetail = this.challengeDetail.asObservable();

    public CoinsName = new BehaviorSubject('');
    currentCoinsName = this.CoinsName.asObservable();

    public CodeName = new BehaviorSubject('');
    currentCodeName = this.CodeName.asObservable();


    url = this.dataUrl;
    listReqURL = "_vti_bin/ListData.svc/"
    transactionInfo = { EventOrPrice: "", Operation: "", Status: "" }
    userScore: any = []
    TabName: any[] = []
    tooLong = 0

    public userProfile: any = {}
    public loadingMSG = "Loading"
    public loading: boolean = false
    public confirmationMessage = ""
    QuizTracker: any;

    constructor(
        private http: HttpClient,

    ) { }

    // private key = CryptoJS.enc.Utf8.parse('4512631236589784');
    private key = CryptoJS.enc.Utf8.parse('3512631236589784'); //must have 16 digit
    private iv = CryptoJS.enc.Utf8.parse('4512125236589734'); //must have 16 digit
    // private iv = CryptoJS.enc.Utf8.parse('4512631236589784');

    // Methods for the encrypt and decrypt Using AES
    encryptUsingAES256(word: string) {
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(word)), this.key, {
            // var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify("Your Json Object data or string")), this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString().replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l');

    }

    decryptUsingAES256(decString: string | CryptoJS.lib.CipherParams) {

        decString = decString.toString().replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=');
        var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var decrypted2 = CryptoJS.AES.decrypt(decString, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // console.log('Decrypted : ' + decrypted);
        // console.log('utf8 = ' + decrypted.toString(CryptoJS.enc.Utf8));
        return decrypted.toString(CryptoJS.enc.Utf8).slice(1, -1);


    }
    getCoinAndCodeName() {
        this.http.get<any>(this.url + this.listReqURL + "SiteDetails", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            for (let key in data.d.results) {
                this.TabName.push(data.d.results[key])

            }
            this.CoinsName = this.TabName[10].Title
            this.CodeName = this.TabName[11].Title
        })
    }
    closeAlert() {
        <HTMLInputElement><unknown>document.getElementById('Alert')?.classList.add("em-is-closed")
    }

    reloadPage() {
        window.location.reload()
    }

    openAlert() {
        <HTMLInputElement><unknown>document.getElementById('Alert')?.classList.remove("em-is-closed")
    }
    waitForCreateAccount(url: string) {
        this.http.get<any>(url).subscribe(data => {
            if (data.d.Status == "Completed") {
                this.openAlert()
                this.loadingMSG = "Loading"
                this.getUserScore()
                this.loading = false

            }
            else if (data.d.Status == "In Progress") {
                this.waitForCreateAccount(url)
            }


        })
    }

    checkCreate() {
        this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
            responseType: 'json', withCredentials: true
        }).subscribe(data1 => {
            this.http.get<any>(this.url + this.listReqURL + "ContactDetails" + "/?$filter=(Name eq '" + data1.d.DisplayName + "')", {
                responseType: 'json'
                // , withCredentials: true
            }).subscribe(data3 => {
                if (data3.d.results.length > 0) {
                    this.loadingMSG = "Loading"
                    // this.openAlert()
                    this.confirmationMessage = "This is your first time on this platform. Welcome " + data3.d.results[0].Name + "!";
                    this.loading = false
                    this.reloadPage()
                }
                else {
                    if (this.tooLong > 4) {
                    }
                    setTimeout(() => {
                        this.checkCreate()
                        this.tooLong += 1

                    }, 500)
                }

            })
        })

    }
    reverseString(str: string) {

        // empty string
        let newString = "";
        for (let i = str.length - 1; i >= 0; i--) {
            newString += str[i];
        }
        return newString;
    }
    getUserScore() {

        this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
            responseType: 'json', withCredentials: true
        }).subscribe(data1 => {
            this.http.get<any>(this.url + this.listReqURL + "ContactDetails" + "/?$filter=(Name eq '" + data1.d.DisplayName + "')", {
                responseType: 'json'
                // , withCredentials: true
            }).subscribe(data => {
                if (data.d.results.length > 0) {
                    let keys: { value: any; creator2: string; }[] = [];
                    for (let key in data.d.results) {
                        keys.push({ value: data.d.results[key], creator2: data1.d.DisplayName });
                    }
                    if (keys[0].value.QuizTracker != null) {
                        this.QuizTracker = this.reverseString(keys[0].value.QuizTracker.toString())
                    }
                    else {
                        this.QuizTracker = "0"

                    }
                    if (keys[0].value.Role == "Blocked") {
                        this.loading = false
                        this.confirmationMessage = "Your account is suspended. Please contact Admin";
                        this.openAlert();
                    }
                    this.changeUserScore(keys); //update leaderboard
                    this.userScore = keys
                    return keys

                }
                else {
                    this.http.get<any>(this.url + this.listReqURL + "Transaction" + "/?$filter=(CreatedBy/WorkEmail eq '" + data1.d.Email + "' and EventOrPrice eq 'create user')", {
                        responseType: 'json'
                        // , withCredentials: true
                    }).subscribe(data => {
                        if (data.d.results.length < 1) {
                            this.transactionInfo.EventOrPrice = "create user"
                            this.transactionInfo.Operation = "Create"
                            this.http.post(this.url + this.listReqURL + "Transaction",
                                JSON.stringify(this.transactionInfo)
                                , { withCredentials: true }
                            ).subscribe(data2 => {
                                this.loading = true;
                                this.loadingMSG = "Initializing account"

                                setTimeout(() => {
                                    this.checkCreate()
                                    // this.tooLong +=1

                                }, 500)

                            })
                        }
                        else {
                            // alert("This is your first time on EMCoin. Welcome!")
                        }
                    })
                    return null

                }
            })
        })
    }
    waitTilComplete(url: string, UserPromo: string) {
        this.http.get<any>(url).subscribe(data => {
            if (data.d.Status == "Completed") {
                this.openAlert()
                this.loadingMSG = "Loading"
                this.getUserScore()
                this.loading = false
                if (UserPromo == 'Yes') {
                    this.confirmationMessage = "earn :" + data.d.Score + this.CoinsName;
                    // this.confirmationMessage = "First convert promotion. earn :" + data.d.Score + this.CoinsName;
                }
                else {
                    this.confirmationMessage = "earn :" + data.d.Score + this.CoinsName;
                }
            }
            else if (data.d.Status == "InCompleted") {
                this.loading = false
                this.confirmationMessage = "Some quiz is misses";
                this.openAlert();
            }
            else if (data.d.Status == "In Progress") {
                this.waitTilComplete(url, UserPromo)
            }
            else if (data.d.Status == 'Duplicate') {
                this.loading = false
                this.confirmationMessage = "You already redeem this Code or it's already reach it's limit.";
                this.openAlert();
            }
            else if (data.d.Status == 'NotFound') {
                this.loading = false
                this.confirmationMessage = "Sorry, code is not found or currently unavailable. Your account will be suspended after 5 fail attempts. Please enter valid code.";
                this.openAlert();
            }
            else if (data.d.Status == 'Suspend') {
                this.loading = false
                this.confirmationMessage = "Your account is suspended due to many false convert. Please contact Admin";
                this.openAlert();
            }
        })
    }
    earn() {
        if (this.userScore[0].value.Role == "Blocked") {
            // alert("Test")
            this.loading = false
            this.confirmationMessage = "Your account is suspended. Please contact Admin";
            this.openAlert();
        }
        else {

            let UserPromo = this.userScore[0].value.Promo
            let eventCode = (<HTMLInputElement>document.getElementById('EventCodeInput')).value
            // let eventCode = this.encryptUsingAES256((<HTMLInputElement>document.getElementById('EventCodeInput')).value);
            // this.transactionInfo.EventOrPrice = this.encryptUsingAES256((<HTMLInputElement>document.getElementById('EventCodeInput')).value + "" + "2M2Edsin6u8eqlqM");
            this.transactionInfo.EventOrPrice = (<HTMLInputElement>document.getElementById('EventCodeInput')).value
            this.transactionInfo.Operation = "earn"
            this.transactionInfo.Status = "In Progress"

            //check for code existent
            this.http.post<any>(this.url + this.listReqURL + "Transaction",
                JSON.stringify(this.transactionInfo)
                , { withCredentials: true }
            ).subscribe(dataPost => {
                this.loading = true
                this.loadingMSG = "Finalizing your transaction. This could take a moment."
                this.waitTilComplete(dataPost.d.__metadata.uri, UserPromo)


            })

        }

    }
    earnQuiz() {
        let UserPromo = this.userScore[0].value.Promo
        // let eventCode = this.encryptUsingAES256((<HTMLInputElement>document.getElementById('EventCodeInput')).value);
        // this.transactionInfo.EventOrPrice = this.encryptUsingAES256((<HTMLInputElement>document.getElementById('EventCodeInput')).value + "" + "2M2Edsin6u8eqlqM");
        this.transactionInfo.EventOrPrice = "Quiz"
        this.transactionInfo.Operation = "earn"
        this.transactionInfo.Status = "In Progress"

        //check for code existent
        this.http.post<any>(this.url + this.listReqURL + "Transaction",
            JSON.stringify(this.transactionInfo)
            , { withCredentials: true }
        ).subscribe(dataPost => {
            this.loading = true
            this.loadingMSG = "Finalizing your transaction. This could take a moment."
            this.waitTilComplete(dataPost.d.__metadata.uri, UserPromo)


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

    getUser() {
        this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            // console.log(data.d)
            this.userProfile = data.d;


        })
    }
    getLeaderBaord() {
        this.loading = true
        let keys: { value: any; creator2: string; }[] = [];
        let indexer = []
        // this.http.get<any>(this.url + this.listReqURL + "ContactDetails" + "?$orderby=EarnedScore%20desc,Modified", {
        this.http.get<any>(this.url + this.listReqURL + "ContactDetails" + "?$orderby=EarnedScore%20desc,Modified", {
            responseType: 'json', withCredentials: true
        }).subscribe(data1 => {
            this.getUser()
            this.LeaderBoard = data1.d.results
            this.myRank = (data1.d.results.findIndex(((item: { Name: any; }) => item.Name === this.userProfile.DisplayName)))

            this.loading = false
        })
    }



    // changeMyRank(message: number) {
    //     this.myRank.next(message)
    // }

    changeChallengeDetail(message: any) {
        this.challengeDetail.next(message)
    }
    changeTempTransaction(message: any[]) {
        this.tempTransaction.next(message)
    }

    changeMyTransaction(message: any[]) {
        this.myTransaction.next(message);
    }
    changeMyTransactionHistory(message: any[]) {
        this.myTransactionHistory.next(message);
    }
    changeMyTransactionHistoryOld(message: any[]) {
        this.myTransactionHistoryOld.next(message);
    }

    changeUser(message: string) {
        this.UserName.next(message);
    }
    changeUserScore(message: any[]) {
        this.UserScore.next(message);
    }
    changeLanguage(message: string) {
        this.langSource.next(message);
    }
    // changeLeaderBoard(message: any[]) {
    //     this.LeaderBoard.next(message);
    // }
    changeReturnLocation(message: string) {
        this.returnLocation.next(message);
    }

    changeCoinsName(message: string) {
        this.CoinsName.next(message)
    }

    changeCodeName(message: string) {
        this.CodeName.next(message)
    }

}


