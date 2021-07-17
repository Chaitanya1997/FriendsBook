import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  user !: User;

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(((data) => {
      this.user = data;
    }));
  }

  logOut() {
    this.authenticationService.logout();
  }

}
