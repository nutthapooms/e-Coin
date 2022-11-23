import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service'
@Component({
  selector: 'my-room',
  templateUrl: './myRoom.component.html',
  styleUrls: ['./myRoom.component.css']
})
export class MyRoomComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public data: DataService
  ) { }

  url = this.data.dataUrl;
  userScore: any = []
  transactionInfo = { EventOrPrice: "", Operation: "", IsGacha: "", Amount: 1 }
  userUpdate = { Name: "Update", Score: 0 }
  imagePath = ""
  coinImagePath = ""
  transactions: any = []
  transactionsHistory: any = []
  transactionsHistoryOld: any = []
  listReqURL = "_vti_bin/ListData.svc/"
  maxHistory = 100
  LuckyDrawBG = this.url + "Picture%20Hub/Group%20102.svg"





  limitcap() {
    this.maxHistory = this.transactionsHistory.length;
  }


  getTabName() {
    this.http.get<any>(this.url + this.listReqURL + "SiteDetails", {
      responseType: 'json'
      , withCredentials: true
    }).subscribe(data => {
      this.imagePath = this.url + "Picture%20Hub/" + data.d.results[1].Picture
      this.coinImagePath = this.url + "Picture%20Hub/" + data.d.results[7].Picture
    });
  }

  filterItemsOfTransactions(gacha: string) {
    return this.transactions.filter(((x: { isGacha: string; }) => x.isGacha == 'yes'));
  }

  groupby(array: any[], key: string, isGacha: string, PictureUrl: string) {
    let finalresult: any = []
    let unitArr: any = []
    let existingArr: string[] = []
    let index = 0
    array.reduce((result, currentValue) => {
      this.http.get<any>(this.data.dataUrl + this.listReqURL + "PrizeList" + "/?$filter=(Title eq '" + currentValue[key] + "')").subscribe(data => {

        if (existingArr.find(element => element == currentValue[key]) == currentValue[key]) {
          result = currentValue
          finalresult[finalresult.findIndex((item: { [x: string]: any; EventOrPrice: any; }) => item.EventOrPrice === currentValue[key])].Unit += currentValue.Amount

        }
        else {
          unitArr[index] = 1
          result = currentValue
          finalresult.push({ EventOrPrice: currentValue[key], Unit: currentValue.Amount, isGacha: currentValue[isGacha], PictureUrl: this.url + "Picture%20Hub/" + data.d.results[0].Picture })
          existingArr.push(currentValue[key])
          index += 1

        }
      })
      return result
    }, {});

    return finalresult
  };


  getUserTransaction() {
    this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
      responseType: 'json', withCredentials: true
    }).subscribe(data1 => {
      this.http.get<any>(this.url + this.listReqURL + "Transaction" + "/?$filter=(CreatedBy/WorkEmail eq '" + data1.d.Email + "' and EventOrPrice ne 'create user' and EventOrPrice ne 'CheckIn' and Status ne 'Duplicate' and Status ne 'NotEnable' and Status ne 'Suspend' and Status ne 'NotFound')", {
        responseType: 'json'
        // , withCredentials: true
      }).subscribe(data => {
        let keys: any[] = [];
        let keys2: any[] = [];

        // ---------------------in Case we need Old data --------------------------------------------
        this.http.get<any>(this.url + this.listReqURL + "TransactionOld" + "/?$filter=(CreatedBy/WorkEmail eq '" + data1.d.Email + "' and EventOrPrice ne 'create user' and EventOrPrice ne 'CheckIn' and Status ne 'Duplicate' and Status ne 'NotFound')", {
          responseType: 'json'
          // , withCredentials: true
        }).subscribe(dataOld => {
          for (let key in dataOld.d.results) {
            let CreateDate = dataOld.d.results[key].Created.replace('/Date(', '')
            dataOld.d.results[key].Created = new Date(parseInt(CreateDate.replace(')/', ''))).toDateString()
            if (dataOld.d.results[key].Operation == 'reduction') {
              keys.push(dataOld.d.results[key])
              keys2.push(dataOld.d.results[key])
            }
            else{
              keys2.push(dataOld.d.results[key])
            }
          }
          for (let key in data.d.results) {
            let CreateDate = data.d.results[key].Created.replace('/Date(', '')
            data.d.results[key].Created = new Date(parseInt(CreateDate.replace(')/', ''))).toDateString()
            if (data.d.results[key].Operation == 'reduction') {
              keys.push(data.d.results[key])
              keys2.push(data.d.results[key])
            }
            else {
              keys2.push(data.d.results[key])
            }
          }
          this.data.changeMyTransactionHistory(keys2.reverse());
          let transactionGroupbyItem = this.groupby(keys, 'EventOrPrice', 'IsGacha', 'PictureUrl')
          this.data.changeMyTransaction(transactionGroupbyItem); //update Transaction
          
        })
        // ------------------------------------------------------------------------------------------
        
      })
    })
  }
  





  ngOnInit() {
    this.getTabName()
    this.getUserTransaction()

    this.data.currentMyTransactionHistory.subscribe(message => this.transactionsHistory = message)
    // this.data.currentMyTransactionHistoryOld.subscribe(message => this.transactionsHistoryOld = message)
    this.data.currentMyTransaction.subscribe(message => {
      this.transactions = message
    })
    this.data.currentUserScore.subscribe(message => this.userScore = message)


  }

}