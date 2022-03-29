import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../shared/model';
import { DataService } from '../data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'shop-site',
  templateUrl: './shopSite.component.html',
  styleUrls: ['./shopSite.component.css'],
})
export class ShopSiteComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public data: DataService,
    private routing: Router

  ) { }



  url = this.data.dataUrl;
  listReqURL = "_vti_bin/ListData.svc/";
  prizeList: any[] = []
  transactionInfo = { EventOrPrice: "", Operation: "", IsGacha: "", Amount: 1 }
  userUpdate = { Name: "Update", Score: 0 }
  userScore: any = []
  userProfile: any = {}
  imagePath = ""
  coinImagePath = ""
  LuckyDrawBG = this.url + "Picture%20Hub/Group%20102.svg"
  confirmationMessage = ""
  confirmBtn = false
  cancelBtn = false

  temp_item = ""
  temp_price = 0
  temp_isGacha = ""
  temp_picture_url = ""
  temp_description = ""
  temp_prize: any = { value: { Title: "", Description: "", ValidUntil: "" } }
  message = ""
  loading = true

  amountsubmit = <HTMLInputElement>document.getElementById('ItemAmount')
  calculator: number = 1




  onKeyUp() {
    let amount1 = (<HTMLInputElement>document.getElementById('ItemAmount')).value
    if(isNaN(parseInt(amount1))){
      this.calculator = 0
    }
    else{
      this.calculator = parseInt(amount1)

    }
    // alert(this.calculator)
  }

  getTabName() {
    this.http.get<any>(this.url + this.listReqURL + "SiteDetails", {
      responseType: 'json'
      , withCredentials: true
    }).subscribe(data => {
      this.imagePath = this.url + "Picture%20Hub/" + data.d.results[2].Picture
      this.coinImagePath = this.url + "Picture%20Hub/" + data.d.results[7].Picture
      this.message = data.d.results[2].Message
    })
  }


  getPrizeDetail() {
    this.prizeList = []

    this.http.get<any>(this.url + this.listReqURL + "PrizeList", {
      responseType: 'json', withCredentials: true
    }).subscribe(data => {
      // console.log(data.d)
      for (let index in data.d.results) {
        this.prizeList.push({ value: data.d.results[index], PictureUrl: this.url + "Picture%20Hub/" + data.d.results[index].Picture });
      }
      this.loading = false
      // console.log(this.prizeList)
    })
  }
  filterItemsOfGacha(gacha: string) {

    return this.prizeList.filter(x => x.value.IsGacha == gacha);
  }
  sortItemPrice() {
    return this.filterItemsOfGacha('No').sort(function (a, b) {
      if (a.value.Price > b.value.Price) {
        return -1;
      }
      else if (b.value.Price > a.value.Price) {
        return 1;
      }
      else {
        return 0;
      }
    })
  }


  checkScore() {
    this.data.currentUserScore.subscribe(message => {
      this.userScore = message
    })
    this.data.currentUserName.subscribe(message => {
      this.userProfile = message
    })
  }
  chooseItem(prizeName: string, price: number, isGacha: string, prize: any) {
    this.temp_item = prizeName
    this.temp_price = price
    this.temp_isGacha = isGacha
    this.temp_picture_url = prize.PictureUrl
    this.temp_description = prize.value.Description
    this.temp_prize = prize;


    if (isGacha == 'yes') {
      this.data.confirmationMessage = "Please specify your amount";
      this.openConfirmationGacha()
    }
    else {
      this.data.confirmationMessage = "Are you sure you want to use " + this.temp_price + " " + this.data.CoinsName + " for " + this.temp_item + " ?";
      // this.data.confirmationMessage = "Please confirm your order";
      this.openConfirmationDefault()
    }
  }

  // onKey(event: any){
  //   event.<HTMLInputElement>document.getElementById('ItemAmount').value
  //   this.amountsubmit = parseInt((<HTMLInputElement>document.getElementById('ItemAmount')).value)
  // }

  redeem(isGacha: string) {
    if (isGacha == 'yes') {
      let amount1 = (<HTMLInputElement>document.getElementById('ItemAmount')).value
      let amount = parseInt((<HTMLInputElement>document.getElementById('ItemAmount')).value);
      if (isNaN(Number(amount)) || amount == 0) {
        this.data.confirmationMessage = "Please Enter Whole Number or amount more than 0";

      }
      else if (amount1.includes('.')) {
        this.data.confirmationMessage = "Please Enter Whole Number";

      }
      else if (amount > 0 && amount % 1 == 0) {
        this.transactionInfo.EventOrPrice = this.temp_item
        this.transactionInfo.Operation = "reduction"
        this.transactionInfo.IsGacha = isGacha
        this.transactionInfo.Amount = amount
        this.closeConfirmationGacha()

        if (this.userScore[0].value.Score >= this.temp_price * amount) {

          this.http.post(this.url + this.listReqURL + "Transaction",
            JSON.stringify(this.transactionInfo)
            , { withCredentials: true }
          ).subscribe(data => {
            this.transactionInfo = { EventOrPrice: "", Operation: "", IsGacha: "", Amount: 1 }
            // this.data.confirmationMessage = "This will take around 5 secconds to check your Transaction details";
            // this.data.openAlert()
            // alert("This will take around 5 secconds to check your Transaction details")
            this.loading = true
            setTimeout(() => {
              this.data.openAlert()
              this.data.confirmationMessage = "You have successfully redeem lucky draw. Good luck on Lucky draw event day";
              this.loading = false
              this.data.getUserScore()
              this.getPrizeDetail()
            }, 5000)
          })
        }
        else {
          this.data.confirmationMessage = "Collect more " + this.data.CoinsName + " for this item";
          this.data.openAlert()
        }
      }
      else {

      }
    }
    else if (isGacha == 'No') {
      this.closeConfirmationDefault()
      // this.data.confirmationMessage = "Are you sure you want to use " + this.temp_price + " for " + this.temp_item + " ?";    
      this.transactionInfo.EventOrPrice = this.temp_item
      // this.transactionInfo.Score = price //This line is no need because Nintex workflow will retrieve data from PrizeList
      this.transactionInfo.Operation = "reduction"
      this.transactionInfo.IsGacha = isGacha
      if (this.userScore[0].value.Score >= this.temp_price) {
        if (this.temp_prize.value.AmountLeft == 0) {
          this.data.confirmationMessage = "Sorry. This item had Sold-out";
          this.data.openAlert()
        }
        else {
          this.http.post(this.url + this.listReqURL + "Transaction",
            JSON.stringify(this.transactionInfo)
            , { withCredentials: true }
          ).subscribe(data => {
            this.transactionInfo = { EventOrPrice: "", Operation: "", IsGacha: "", Amount: 1 }

            // this.data.confirmationMessage = "This will take around 5 secconds to check your Transaction details";
            this.loading = true
            setTimeout(() => {
              this.data.openAlert()

              this.data.confirmationMessage = "redeem success Admin will contact you weekly for your rewards.";
              this.loading = false
              this.data.getUserScore()
              this.getPrizeDetail()


            }, 5000)
          })
        }
      }
      else {
        this.data.confirmationMessage = "Collect more " + this.data.CoinsName + " for this item";
        this.data.openAlert()
      }
    } else {

    }
  }



  setWaitmessage() {
    this.loading = false
    this.data.confirmationMessage = "redeem success"
  }

  closeConfirmationDefault() {
    <HTMLInputElement><unknown>document.getElementById('comfirmation_default')?.classList.add("em-is-closed")
  }
  openConfirmationDefault() {
    <HTMLInputElement><unknown>document.getElementById('comfirmation_default')?.classList.remove("em-is-closed")
  }
  closeConfirmationGacha() {
    <HTMLInputElement><unknown>document.getElementById('comfirmation_gacha')?.classList.add("em-is-closed")
  }
  openConfirmationGacha() {
    <HTMLInputElement><unknown>document.getElementById('comfirmation_gacha')?.classList.remove("em-is-closed")
  }


  confirmBtnpress() {
    this.confirmBtn = true
    this.closeConfirmationGacha()
  }

  ngOnInit() {
    this.getTabName()
    this.getPrizeDetail();
    this.checkScore();
  }

}