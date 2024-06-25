import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { LoveToShopFromService } from 'src/app/services/love-to-shop-from.service';
import { Love2ShopValidators } from 'src/app/validators/love2-shop-validators';

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
        firstName: new FormControl('', [Validators.required,
           Validators.minLength(2),
            Love2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
                              Validators.minLength(2),
                              Love2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required,
                              Validators.minLength(2),
                              Love2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                              Validators.minLength(2),
                              Love2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
                              Validators.minLength(2),
                              Love2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required,
                              Validators.minLength(2),
                              Love2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                              Validators.minLength(2),
                              Love2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
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

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lasttName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippinAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippinAddress.city');}
  get shippingAddressStatet(){return this.checkoutFormGroup.get('shippinAddress.state');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippinAddress.zipCode');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippinAddress.country');}

  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddressStreet.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddressCity.city');}
  get billingAddressStatet(){return this.checkoutFormGroup.get('billingAddressStatet.state');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddressZipCode.zipCode');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddressCountry.country');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCardType.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCardNameOnCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCardNumber.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCardSecurityCode.securityCode');}


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
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);
  }

}
