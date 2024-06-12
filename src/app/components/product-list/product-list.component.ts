import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {



  products: Product[] = [];
  currentCategoryId: number = 1;
  previouseCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  thepreviousKeyword: string = "";
  
  constructor(private productService: ProductService,
    private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode){
    this.handleSearchProducts()}
    else{
      this.handleListProducts();
    }
  }
  handleSearchProducts(){
    const theKeyword: string  = this.route.snapshot.paramMap.get('keyword')!;

    if (this.thepreviousKeyword != theKeyword){
      this.thePageNumber = 1;
    }
    this.thepreviousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                              this.thePageNumber,
                                              theKeyword).subscribe(this.processResult());
  }

  
  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      this.currentCategoryId = 1;
    }

    if (this.previouseCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              this.currentCategoryId)
                                              .subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    )
  }
  processResult(){
    return (data: any) => {
      this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
    }
  }
  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.currentCategoryId = 1;
    this.listProducts();

    }
    addToCart(theProduct: Product){
      console.log(`Adding to cart: ${theProduct.name},
      ${theProduct.unitPrice}`);
      const theCartItem = new CartItem(theProduct);
      this.cartService.addToCart(theCartItem);
    }

}
