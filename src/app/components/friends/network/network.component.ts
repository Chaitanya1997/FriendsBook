import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UserHelperService } from 'src/app/helpers/user-helper.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  networkUsers: any[] = [];
  currentUser: any;
  noUsers: Boolean = false;
  isLoading: Boolean = true;
  isLoadingError: Boolean = false;

  constructor(
    private userService: UserService,
    private userHelper: UserHelperService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  }

  ngOnInit() {
    this.userService.getAll().subscribe((allUsers: any) => {
      if (allUsers.length <= 1) {
        this.isLoading = false;
        this.noUsers = true;
        return;
      }

      this.userHelper.createNetworkUserList(this.currentUser._id, allUsers).subscribe(
        (networkUsers: any) => {
          this.isLoading = false;
          this.noUsers = networkUsers.length === 0 ? true : false;
          this.networkUsers = networkUsers;
        },
        (error: any) => {
          this.isLoading = false;
          this.isLoadingError = error;
        });
    });
  }

  onRequestButtonClick(userClicked: any) {
    let friendRequestObject = {
      id: '',
      userId: this.currentUser._id,
      friendId: userClicked.id,
      status: 'Request Pending'
    }

    this.userHelper.createNewFriendRequest(friendRequestObject).subscribe(() => {
      this.ngOnInit();
    });
  }
}
