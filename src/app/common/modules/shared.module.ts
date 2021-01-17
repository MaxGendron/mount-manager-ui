import { FooterComponent } from './../../footer/footer.component';
import { AuthGuard } from './../../users/auth.guard';
import { MyMountsComponent } from './../../mounts/my-mounts/my-mounts.component';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from '../../index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularMaterialModule } from './angular-material.module';
import { MyAccountComponent } from '../../my-account/my-account.component';
import { BulkAddComponent } from 'src/app/mounts/bulk-add/bulk-add.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard] },
  { path: 'my-mounts', component: MyMountsComponent, canActivate: [AuthGuard] },
  { path: 'bulk-add', component: BulkAddComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RouterModule.forRoot(appRoutes),
    AngularMaterialModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule,
    RouterModule,
    AngularMaterialModule,
    FooterComponent
  ],
})
export class SharedModule {}
