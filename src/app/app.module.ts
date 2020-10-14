import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './common/interceptor/jwt.interceptor';
import { ErrorInterceptor } from './common/interceptor/error.interceptor';
import { IndexComponent } from './index/index.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UsersModule } from './users/users.module';
import { SharedModule } from './common/modules/shared.module';
import { MyAccountModule } from './my-account/my-account.module';
import { MountsModule } from './mounts/mounts.module';

@NgModule({
  declarations: [AppComponent, IndexComponent, NavbarComponent],
  imports: [UsersModule, SharedModule, MyAccountModule, MountsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
