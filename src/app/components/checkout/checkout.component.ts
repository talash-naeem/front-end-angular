import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { LoveToShopFromService } from 'src/app/services/love-to-shop-from.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  craditCardYears: number[] = [];
  carditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressState: State[] = [];
  billingAddressState: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private love2ShopFromService: LoveToShopFromService) { }

  ngOnInit(): void {
    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    this.love2ShopFromService.getCarditMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved cradit card months: " + JSON.stringify(data));
        this.carditCardMonths = data;
      }
    );

    this.love2ShopFromService.getCarditCardYear().subscribe(
      data => {
        console.log("Retrieved Credit card year: " + JSON.stringify(data));
        this.craditCardYears = data;
      }
    )

    this.love2ShopFromService.getCountries().subscribe(
      data => {
        console.log("Retrieved Countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
            this.billingAddressState = this.shippingAddressState;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressState = [];
    }
    
  }
  handleMonthAndYear(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const seclectYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;
    if(currentYear === seclectYear){
      startMonth = new Date().getMonth() + 1;
    }else {
      startMonth = 1;
    }
    this.love2ShopFromService.getCarditMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.carditCardMonths = data ;
      }
    )
  }

  getState(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.love2ShopFromService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress'){
          this.shippingAddressState = data;
        }
        else{
          this.billingAddressState = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }


  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);
  }

}
