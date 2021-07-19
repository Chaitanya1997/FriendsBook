import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user !: User;
  isAdmin: Observable<boolean>;
  isUserLoggedIn: Observable<boolean>;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.isAdmin = authenticationService.isAdmin();
    this.isUserLoggedIn = authenticationService.isUserLoggedIn();

    // Listen changes to user value
    this.authenticationService.currentUser.subscribe(((data) => {
      this.user = data;
    }));

    console.log(this.isAdmin, this.isUserLoggedIn);
  }

  ngOnInit(): void {

  }

  logOut() {
    this.authenticationService.logout();
  }

}
