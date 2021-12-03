import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
    public dataUrl = 'https://ishareteam4.na.xom.com/sites/THAAreaOps/CusEng/ITFairOnline2/'
    // public dataUrl = 'https://ishareteam2.na.xom.com/sites/CHEMGMO18/WAEM/vcoin/ITFairOnline2/'

    // public urlLocation = 'http://localhost:4200';
    public urlLocation = 'https://ishareteam4.na.xom.com/sites/THAAreaOps/CusEng/ITFairOnline2/package/Code/index.html';
    // public urlLocation = 'https://ishareteam2.na.xom.com/sites/CHEMGMO18/WAEM/vcoin/ITFairOnline2/package/Code/index.html';

    private returnLocation = new BehaviorSubject('/Landing-site');
    currentReturnLocation = this.returnLocation.asObservable();

    private UserName = new BehaviorSubject({});
    currentUserName = this.UserName.asObservable();

    private UserScore = new BehaviorSubject([{ value: { Score: 0 } }]);
    currentUserScore = this.UserScore.asObservable();

    private LeaderBoard = new BehaviorSubject([""]);
    currentLeaderBoard = this.LeaderBoard.asObservable();

    private langSource = new BehaviorSubject('eng');
    currentLanguage = this.langSource.asObservable();

    private myRank = new BehaviorSubject(-1);
    currentMyRank = this.myRank.asObservable();

    private myTransaction = new BehaviorSubject([""]);
    currentMyTransaction = this.myTransaction.asObservable();

    private myTransactionHistory = new BehaviorSubject([""]);
    currentMyTransactionHistory = this.myTransactionHistory.asObservable();

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
    transactionInfo = { EventOrPrice: "", Operation: "" }
    userScore: any = []
    TabName: any[] = []
    tooLong = 0

    public userProfile: any = {}
    public loadingMSG = "Loading"
    public loading: boolean = false
    public confirmationMessage = ""

    constructor(
        private http: HttpClient
    ) { }
    getCoinAndCodeName() {
        this.http.get<any>(this.url + this.listReqURL + "SiteDetails", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            console.log(data)
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
                    this.openAlert()
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
                                    console.log("creating account")
                                    // this.tooLong +=1

                                }, 500)

                            })
                        }
                        else {
                            // alert("This is your first time on VCoin. Welcome!")
                        }
                    })
                    return null

                }
            })
        })
    }

    earn() {
        let UserPromo = this.userScore[0].value.Promo
        let eventCode = (<HTMLInputElement>document.getElementById('EventCodeInput')).value
        this.transactionInfo.EventOrPrice = (<HTMLInputElement>document.getElementById('EventCodeInput')).value;
        this.transactionInfo.Operation = "earn"
        this.http.get<any>(this.url + this.listReqURL + "ChallengesDetail" + "/?$filter=(EventCode eq '" + eventCode + "')", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {

            if (data.d.results.length > 0 && data.d.results[0].Active != 'Disable' && data.d.results[0].CodeLimit > 0) { //check for code existent
                this.http.get<any>(this.url + this.listReqURL + "Transaction" + "/?$filter=(CreatedBy/WorkEmail eq '" + this.userProfile.Email + "' and EventOrPrice eq '" + eventCode + "')"
                    , { withCredentials: true }
                ).subscribe(dataCode => {
                    if (dataCode.d.results.length == 0) {
                        this.http.post(this.url + this.listReqURL + "Transaction",
                            JSON.stringify(this.transactionInfo)
                            , { withCredentials: true }
                        ).subscribe(data1 => {
                            this.loading = true
                            this.loadingMSG = "Finalizing your transaction"
                            setTimeout(() => {
                                this.openAlert()
                                this.loadingMSG = "Loading"
                                this.getUserScore()
                                this.loading = false
                                if (UserPromo == 'Yes') {
                                    this.confirmationMessage = "First convert promotion. earn :" + data.d.results[0].Score + " x " + this.userScore[0].value.PromoMultiplier + this.CoinsName;
                                }
                                else {
                                    this.confirmationMessage = "earn :" + data.d.results[0].Score + this.CoinsName;
                                }
                                // window.location.reload()
                            }, 5000)
                        })
                    }
                    else {
                        this.confirmationMessage = "You already redeem this event code!";
                        this.openAlert();

                    }
                })
            }
            else {

                this.confirmationMessage = "Event Code Not found, Reach limit or Event is Disable at a time"
                this.openAlert()
            }
        })
    }

    changeMyRank(message: number) {
        this.myRank.next(message)
    }

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

    changeUser(message: string) {
        this.UserName.next(message);
    }
    changeUserScore(message: any[]) {
        this.UserScore.next(message);
    }
    changeLanguage(message: string) {
        this.langSource.next(message);
    }
    changeLeaderBoard(message: any[]) {
        this.LeaderBoard.next(message);
    }
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


