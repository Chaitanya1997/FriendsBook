import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/Post';
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
  activeUserObject!: User;
  uploadedImage: any;
  url: string | ArrayBuffer | null | undefined;
  existingPhotoId!: string;
  posts!: Post[];
  postsLoading: boolean = true;
  postsLoadingError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private postService: PostService,
    private authenticationService: AuthenticationService
  ) {

    this.authenticationService.currentUser.subscribe(((data) => {
      this.activeUserObject = data;
    }));

    this.form = this.formBuilder.group({
      post: ['', Validators.required],
      userId: [this.activeUserObject._id],
      userPhotoId: [this.existingPhotoId],
      userName: [this.activeUserObject.firstName + ' ' + this.activeUserObject.lastName],
      isAdmin: [this.activeUserObject.isAdmin],
      profession: [this.activeUserObject.profession]
    });
  }

  user !: User;

  ngOnInit(): void {
    this.existingPhotoId = localStorage.getItem('currentUserPhotoId')!;
    this.getAllPosts();
  }

  getAllPosts() {
    this.postsLoading = true;
    this.apiService.getAllPosts().subscribe(
      (data: any) => {
        console.log(data);
        this.postsLoading = false;
        this.posts = [...data];
      },
      (error) => {
        console.log(error);
        this.postsLoadingError = true;
        this.postsLoading = false;
      }
    );
  }

  onSubmit() {

    if (this.form.invalid)
      return;

    const formData = new FormData();
    formData.append('picture', this.uploadedImage);

    console.log(this.form.value.post);

    if (this.uploadedImage != null) {
      this.postService.uploadPostImage(this.form.value, formData).subscribe(() => {
        this.ngOnInit();
      });
    }
    else {
      this.apiService.createPost(this.form.value).subscribe(() => {
        this.ngOnInit();
      })
    }
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
      this.uploadedImage = event.target.files[0];
    }

  }

}
