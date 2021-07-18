import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  form: FormGroup;
  currentUser!: User;
  uploadedImageEvent: any;
  url: string | ArrayBuffer | null | undefined;
  existingPhotoId!: string;
  posts!: Post[];
  noPosts: boolean = false;
  postsLoading: boolean = true;
  postsLoadingError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private postService: PostService,
    private authenticationService: AuthenticationService
  ) {

    // Current user value
    this.currentUser = this.authenticationService.currentUserValue;

    this.form = this.formBuilder.group({
      post: ['', Validators.required],
      userId: [this.currentUser._id],
      userPhotoId: [this.existingPhotoId],
      userName: [this.currentUser.firstName + ' ' + this.currentUser.lastName],
      isAdmin: [this.currentUser.isAdmin],
      profession: [this.currentUser.profession]
    });

  }

  ngOnInit(): void {
    this.existingPhotoId = localStorage.getItem('currentUserPhotoId')!;
    this.loadPosts();
  }

  loadPosts() {
    this.postsLoading = true;
    this.postService.loadPosts(this.currentUser._id).subscribe(
      (finalPosts: any) => {
        console.log(finalPosts);
        this.postsLoading = false;
        this.noPosts = finalPosts.length <= 0 ? true : false;
        this.posts = [...finalPosts];
      },
      () => {
        this.postsLoadingError = true;
        this.postsLoading = false;
      }
    );
  }

  onSubmit() {
    if (this.form.invalid)
      return;

    if (this.uploadedImageEvent != null) {
      this.postService.uploadPostImage(this.form.value, this.uploadedImageEvent).subscribe(() => {
        this.ngOnInit();
      });
    }
    
    else {
      this.apiService.createPost(this.form.value).subscribe(() => {
        this.ngOnInit();
      })
    }
  }

  onHidePostClick(postToHide: Post) {
    postToHide.isActive = false;
    this.apiService.updatePost(postToHide).subscribe(() => {
      this.loadPosts();
    });
  }

  onPostImageUpload(event: any) {

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event?.target?.result;
      }
    }

    if (event.target.files.length > 0) {
      this.uploadedImageEvent = event;
    }

  }

}
