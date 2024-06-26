import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8081/api/products';

  private categoryUrl = 'http://localhost:8081/api/product-category';

  
  constructor(private httpClient: HttpClient) { }


  getProductListPaginate(thePage: number,
                        thePageSize: number,
                        theCategoryId: number): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
   
  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    
    return this.getProducts(searchUrl);
  }
  getProductCategories(): Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductsCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
  searchProducts(theKeyword: string): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByContaining?name=${theKeyword}`;
    
    return this.getProducts(searchUrl);
  }
  searchProductsPaginate(thePage: number,
                        thePageSize: number,
                        theKeyword: string): Observable<GetResponseProducts> {
const searchUrl = `${this.baseUrl}/search/findByContaining?name=${theKeyword}`
+ `&page=${thePage}&size=${thePageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}
  private getProducts(searchUrl: string): Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  getProduct(theProductId: number): Observable<Product>{
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
interface GetResponseProductsCategory {
  _embedded: {
   productCategory : ProductCategory[];
  }
}