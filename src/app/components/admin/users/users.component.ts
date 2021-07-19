import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  isLoading: Boolean = true;
  isLoadingError: Boolean = false;
  noUsers: Boolean = false;
  currentUser: User;

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private authenticationService: AuthenticationService,
  ) { 
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      (users) => {
        users = _.filter(users, function (user) { return user.isAdmin !== true });
        this.isLoading = false;
        this.noUsers = users.length === 0 ? true : false;
        this.users = users;
      },
      (err) => {
        this.toastService.danger('Data Loading Error: ' + err.status + ' - ' + err.statusText);
        throw err;
      });
  }

  onDisableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: false
    };

    this.userService.updateUser(detailsToUpdate).subscribe(() => {
      this.ngOnInit();
    });
  }

  onEnableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: true
    };
    this.userService.updateUser(detailsToUpdate).subscribe(() => {
      this.ngOnInit();
    });
  }
}
