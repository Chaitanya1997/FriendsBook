import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { DatePipe } from '@angular/common';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { PostsComponent } from './components/home/posts/posts.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { JwtInterceptor } from './helpers/interceptors/jwt.interceptor';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { FriendsComponent } from './components/friends/friends/friends.component';
import { FriendRequestsComponent } from './components/friends/friend-requests/friend-requests.component';
import { NetworkComponent } from './components/friends/network/network.component';
import { FriendsHomeComponent } from './components/friends/friends-home/friends-home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from './components/shared/toasts-container.componen';
import { SettingsComponent } from './components/user/settings/settings.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { PasswordMatchValidatorDirective } from './helpers/directives/password-match-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    PostsComponent,
    ProfileComponent,
    UserProfileComponent,
    FriendsComponent,
    NetworkComponent,
    FriendRequestsComponent,
    FriendsHomeComponent,
    SettingsComponent,
    AlertComponent,
    ToastsContainer,
    PasswordMatchValidatorDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    PasswordMatchValidatorDirective,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
