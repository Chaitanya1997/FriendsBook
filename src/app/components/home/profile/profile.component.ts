import { Component, Input, OnInit } from '@angular/core';
import { ProfileHelperService } from 'src/app/helpers/profile-helper.service';
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
  imageToShow: any;
  isImageLoaded: Boolean = false;
  isImageAvailable: Boolean = false;

  @Input() currentUser!: User;

  constructor(
    private apiService: ApiService,
    private profileHelper: ProfileHelperService,
    private authenticationService: AuthenticationService,
    private friendsService: FriendService
  ) { }

  ngOnInit(): void {
    this.loadActiveUserPhoto(this.currentUser.photoId);
    this.loadActiveUserConnections(this.currentUser._id!);
    this.loadActiveUserPostCounts(this.currentUser._id!);
  }


  loadActiveUserPhoto(photoId: String) {
    this.apiService.getPhotoById(photoId).subscribe(result => {
      this.createImageFromBlob(result);
      this.isImageLoaded = true;
    }, err => {
      this.isImageLoaded = true;
      this.isImageAvailable = false;
    });
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

  onProfilePhotoUpload(event: any) {
    this.profileHelper.changeActiveUserProfilePhoto(this.currentUser._id, event)
      .subscribe(newPhotoId => {
        this.authenticationService.currentUserValue.photoId = newPhotoId;
        localStorage.setItem('currentUserPhotoId', newPhotoId);
        this.loadActiveUserPhoto(newPhotoId);
      });
  }

  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      this.isImageAvailable = true;
      reader.readAsDataURL(image);
    }
  }

}
