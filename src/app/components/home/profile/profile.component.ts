import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FriendService } from 'src/app/services/friends.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  noOfPosts: number = 0;
  noOfConnections: number = 0;
  user !: User;

  constructor(
    private apiService: ApiService,
    private friendsService: FriendService,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe((value) => {
      this.user = value;
    })
  }

  ngOnInit(): void {
    this.loadActiveUserConnections(this.user._id!);
    this.loadActiveUserPostCounts(this.user._id!);
  }

  loadActiveUserPostCounts(userId: string) {
    this.apiService.getAllPostsByUserId(userId).subscribe(
      (data: any) => {
        data && console.log(data?.length);
        data && (this.noOfPosts = data?.length);
      })
  }

  loadActiveUserConnections(userId: string) {
    this.friendsService.getAllFriendRequests().subscribe(result => {
      let matchingElement = _.filter(result, function (item) {
        return (item.userId === userId || item.friendId === userId) && item.status === 'You are friend';
      });
      this.noOfConnections = matchingElement.length;
    });
  }

}
