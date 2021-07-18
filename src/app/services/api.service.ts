import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Post } from '../models/post';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  user!: User;
  httpOptions: { headers: HttpHeaders; };
  apiBaseURL: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(((data) => {
      this.user = data;
    }));

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.user.token
      })
    };

  }

  getAllPosts() {
    return this.http.get<any[]>(`${environment.apiUrl}/posts/`, this.httpOptions);
  }

  updateBulkPosts(updatePayload: any) {
    return this.http.post<Post>(this.apiBaseURL + '/posts/updatemanyposts', updatePayload).pipe(res => {
      return res;
    });
  }

  getAllPostsByUserId(userId: string) {
    return this.http.post(`${environment.apiUrl}/posts/findpostbyuserid`, { id: userId }, this.httpOptions);
  }

  createPost(reqBody: any) {
    return this.http.post(`${environment.apiUrl}/posts/createpost`, reqBody, this.httpOptions);
  }

  updatePost(updatedPost: Post) {
    return this.http.put<Post>(this.apiBaseURL + 'posts/' + updatedPost.id, updatedPost).pipe(res => {
      return res;
    });
  };

  /* 
  ***      ***
  *** FILE ***
  ***      ***
  */
  uploadImage(formData: FormData) {
    return this.http.post<any>(`${environment.apiUrl}/files/uploadfile`, formData).pipe(res => {
      return res;
    });
  }

  getPhotoById(photoId: String) {
    return this.http.get(this.apiBaseURL + '/files/' + photoId, { responseType: "blob" }).pipe(res => {
      return res;
    });
  }

}
