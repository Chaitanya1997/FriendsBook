import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { FriendRequestsComponent } from './components/friends/friend-requests/friend-requests.component';
import { FriendsHomeComponent } from './components/friends/friends-home/friends-home.component';
import { FriendsComponent } from './components/friends/friends/friends.component';
import { NetworkComponent } from './components/friends/network/network.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { SettingsComponent } from './components/user/settings/settings.component';
import { AuthGuard } from './helpers/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'login/:id', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'friends',
    component: FriendsHomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: FriendsComponent,
      },
      {
        path: 'friend-requests',
        component: FriendRequestsComponent,
      },

      {
        path: 'network',
        component: NetworkComponent,
      }
    ]
  },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
