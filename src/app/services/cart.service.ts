import { Injectable } from '@angular/core';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();


  constructor() { }

  addToCart(theCartItem: CartItem){

    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0){
      // for( let tempCartItem of this.cartItems){
      //   if (tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      existingCartItem = this.cartItems.find( tempCartItem =>
        tempCartItem.id === theCartItem.id);
      alreadyExistInCart = (existingCartItem!== undefined);
    }
    if (alreadyExistInCart && existingCartItem){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new value
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems ){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name},
                  quantity=${tempCartItem.quantity}, 
                  unitPrice=${tempCartItem.unitPrice},
                  subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)},
                totalQuantity: ${totalQuantityValue}`);
    console.log('------------')
      }
  decrementQuantity(theCartItem: CartItem){
    theCartItem.quantity--;
    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }
  remove(tempCartItem: CartItem){
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id === tempCartItem.id);

      if(itemIndex > -1){
        this.cartItems.splice(itemIndex, 1);
        this.computeCartTotals();
      }
  }

}
