import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';

export interface paymentinfo {
  paymentMethod:string,
  paymentRef:string,
  paymentTrackID:string,
  amount:number,
  currency:string,
  hg:string
}

@Component({
  selector: 'app-pre-confirmation',
  templateUrl: './pre-confirmation.component.html',
  styleUrls: ['./pre-confirmation.component.scss']
})
export class PreConfirmationComponent implements OnInit {

  url:string ='';
  Loading:boolean = true;
  Failed:boolean=false;
  searchId:string='';
  HGNum:string='';
  token:string='';
  posturl:string='';
  result:any;
  src:string = '';
  paymentError:string ="Somthing Went Wrong During Payment. But don't worry! our Customer Service will Help You to Complete Your Booking :)";
  paymentErrorStatus:boolean =false;
  paymentinfo!:paymentinfo
  myDate = new Date();
  amount:number = 0;
  currency:string = '';
  public confirmation = inject(ConfirmationService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private subscription:Subscription=new Subscription();

  constructor() { }

  ngOnInit(): void {
    const queryParams = { ...this.route.snapshot.queryParams };

    this.searchId = this.route.snapshot.queryParamMap.get('sid') || '';
    this.HGNum =this.route.snapshot.queryParamMap.get('HG') || '';
    this.token =this.route.snapshot.queryParamMap.get('tok')|| '';
    this.src = this.route.snapshot.queryParamMap.get('sc')|| '';
    this.url = this.router.url;
    //to extract data from url
    const trandata = queryParams['trandata'];
const errorText = queryParams['errorText'];

// If trandata exists, construct knet_data and remove trandata/errorText from query
if (trandata) {
  const knetData = {
    errorText: errorText || '',
    trandata: trandata
  };

  // Remove old keys
  delete queryParams['trandata'];
  delete queryParams['errorText'];

  // Add new knet_data key
  queryParams['knet_data'] = JSON.stringify(knetData);
}

// Rebuild the query string manually
const queryString = new URLSearchParams(queryParams).toString();
this.url = queryString;
//calling the APi method
this.subscription.add(this.confirmation.api.getPaymentResult(this.url).subscribe(
(result)=>{
  this.result=result;
  this.amount = this.result.PaymentFareDetails.TotalAmount;
  this.currency = this.result.PaymentFareDetails.CustomerPaymentCurrency;
  if(this.result.Status==0){
    this.posturl = this.result.paymentResult.PostPayment;
    let theToken = this.result.HGToken
    this.subscription.add(this.confirmation.api.PostProcessing(theToken,this.posturl).subscribe(
      (result)=>{
        if(result.status == 0 && this.src != 'mob'){
          this.router.navigate(['/paymentresult/flightConfirmation'],{ queryParams: {'sid':this.searchId,'HG':this.HGNum,'tok':theToken} });
        }
        else{
          this.paymentErrorStatus = true;
          this.Loading =false ;
           this.paymentinfo = {
            paymentMethod: result.paymentMethod ? result.paymentMethod : "knet",
            paymentRef: result.paymentRef,
            paymentTrackID: result.paymentTrackID,
            amount: this.amount,
            currency:this.currency,
            hg:this.HGNum
          }
          
         }
         
      },
      (error)=>{
        this.paymentErrorStatus = true;
        this.Loading = false
      }
    ));

  }  else {
    this.paymentErrorStatus = true;
  }
},
(error)=>{
  this.paymentErrorStatus = true;
  this.Loading = false
  console.error("get payment result error",error);
}
));
  }
  NavigateToHome(){
    this.router.navigate(['/']);
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
