import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/Post';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private apiService: ApiService,
  ) { }

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
      filteredPosts.forEach((postElement: any) => {
        postElement.isMyPost = postElement.userId === userId ? true : false;
        this.apiService.getPhotoById(postElement.userPhotoId).subscribe(
          (res: any) => {
            this.createImageFromBlob(res).subscribe(response => {
              postElement.userIcon = response;
              observer.next(filteredPosts);
            })
          },
          (err: any) => {
            throw err;
          });
      });
    });
  }

  private loadPostImages(mappedPosts: any): Observable<any> {
    return new Observable(observer => {
      mappedPosts.forEach((postElement: any) => {
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

  createNewPost(formObject: any, uploadId: string): Observable<any> {
    return new Observable(observer => {
      const postObject = {
        post: formObject.post,
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

  performPictureUploading(formData: FormData): Observable<any> {
    return new Observable(observer => {
      this.apiService.uploadImage(formData).subscribe(uploadResult => {
        observer.next(uploadResult);
      });
    });
  }

  uploadPostImage(formObject: Post, imageFormData: FormData): Observable<any> {
    return new Observable(observer => {
      this.performPictureUploading(imageFormData).subscribe(uploadResult => {
        this.createNewPost(formObject, uploadResult.uploadId).subscribe(() => {
          observer.next(uploadResult);
        });
      });
    });
  }
}
