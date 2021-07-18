import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'underscore';
import { Post } from '../models/post';


import { UtilityService } from '../services/utility.service';
import { ApiService } from '../services/api.service';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private utility: UtilityService,
    private apiService: ApiService
  ) { }

  calculatePostTimers(filteredPosts: any): Post[] {
    filteredPosts.forEach(
      (element: any) => {
        element.postTimer = this.utility.dateDifference(element.createdDate);
      });
    return filteredPosts.reverse();
  }

  private createImageFromBlob(image: Blob): Observable<any> {
    return new Observable(observer => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        let imageToShow = reader.result;
        observer.next(imageToShow);
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      }
    })
  }

  private loadUserIconForPosts(filteredPosts: any, userId: String): Observable<any> {
    return new Observable(observer => {
      filteredPosts.forEach(
        (postElement: any) => {
          postElement.isMyPost = postElement.userId === userId ? true : false;
          this.apiService.getPhotoById(postElement.userPhotoId).subscribe(
            (res: any) => {
              this.createImageFromBlob(res).subscribe(response => {
                postElement.userIcon = response;
                observer.next(filteredPosts);
              })
            },
            (err) => {
              throw err;
            });
        });
    });
  }

  private loadPostImages(mappedPosts: any): Observable<any> {
    return new Observable(observer => {
      mappedPosts.forEach(
        (postElement: any) => {
          if (postElement.postImageId) {
            postElement.isPostImage = true;
            this.apiService.getPhotoById(postElement.postImageId).subscribe(res => {
              this.createImageFromBlob(res).subscribe(response => {
                postElement.postImage = response;
                observer.next(mappedPosts);
              });
            });
          } else {
            postElement.isPostImage = false;
            observer.next(mappedPosts);
          }
        });
    });
  }

  loadPosts(userId: any): Observable<any> {
    return new Observable(observer => {
      this.apiService.getAllPosts().subscribe(posts => {
        if (posts.length === 0) {
          observer.next(posts);
        }

        let activePosts = _.filter(posts, function (post) { return post.isActive === true; });
        let aggregatePosts = this.calculatePostTimers(activePosts);

        this.loadUserIconForPosts(aggregatePosts, userId).subscribe(mappedPosts => {
          this.loadPostImages(mappedPosts).subscribe(finalPosts => {
            observer.next(finalPosts);
          });
        });
      });
    });
  }

  createNewPost(formObject: Post, uploadId: string): Observable<any> {
    return new Observable(observer => {
      const postObject = {
        id: formObject.id,
        post: '',
        userId: formObject.userId,
        userName: formObject.userName,
        userPhotoId: formObject.userPhotoId,
        postImageId: uploadId,
        isActive: true,
        isAdmin: formObject.isAdmin,
        profession: formObject.profession
      };

      this.apiService.createPost(postObject).subscribe(() => {
        observer.next();
      });
    });
  }

  performPictureUploading(imageEvent: any): Observable<any> {
    return new Observable(observer => {
      if (imageEvent.target.files.length > 0) {
        const file = imageEvent.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        this.apiService.uploadImage(formData).subscribe(
          (uploadResult: any) => {
            observer.next(uploadResult);
          });
      }
    });
  }

  uploadPostImage(formObject: any, imageEvent: any): Observable<any> {
    return new Observable(observer => {
      this.performPictureUploading(imageEvent).subscribe(uploadResult => {
        this.createNewPost(formObject, uploadResult.uploadId).subscribe(() => {
          observer.next(uploadResult);
        });
      });
    });
  }

}
