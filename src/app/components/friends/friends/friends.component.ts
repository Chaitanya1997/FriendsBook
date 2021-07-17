import { Component, OnInit } from '@angular/core';
import { UserHelperService } from 'src/app/helpers/user-helper.service';
import { Friend } from 'src/app/models/friend';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  friends: any[] = [];
  currentUser: any;
  noFriends!: Boolean;
  isLoading: Boolean = true;
  isLoadingError: Boolean = false;

  constructor(private userHelper: UserHelperService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  }

  ngOnInit() {
    this.userHelper.loadRequestingFriends(this.currentUser._id).subscribe(finalRequesters => {
      this.isLoading = false;
      this.noFriends = finalRequesters.length === 0 ? true : false;
      this.friends = finalRequesters;
    });
  }

  onAcceptButtonClick(friendClicked: any) {
    let friendRequestObject = {
      id: friendClicked.id,
      status: 'You are friend'
    }

    this.userHelper.updateFriendRequest(friendRequestObject).subscribe(() => {
      this.ngOnInit();
    });
  }

  onRejectButtonClick(friendClicked: any) {
    let friendRequestObject = {
      id: friendClicked.id,
      status: 'Request Rejected'
    }

    this.userHelper.updateFriendRequest(friendRequestObject).subscribe(() => {
      this.ngOnInit();
    });
  }
}
