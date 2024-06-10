import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';

import { Route, RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
const routes: Routes = [
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'cotegory/:id', component: ProductListComponent},
  {path: 'cotegory', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    ProductCategoryMenuComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
