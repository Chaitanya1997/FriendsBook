import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';
import { AuthenticationService } from './authentication.service';
import { User } from '../models/user';
import { Friend } from '../models/friend';

@Injectable({
  providedIn: 'root'
})

export class FriendService {

  apiBaseURL = environment.apiUrl;
  httpOptions: { headers: any; };
  user!: User;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private toastService: ToastService
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

  createRequest(newRequest: Friend) {
    return this.http.post<Friend>(this.apiBaseURL + '/friends/createrequest', newRequest,)
      .pipe(map(res => {
        this.toastService.success('Friend Request Sent Successfully !');
        return res;
      }));
  }

  getAllFriendRequests() {
    return this.http.get<any[]>(this.apiBaseURL + '/friends/');
  }

  getFriendById(id: String) {
    return this.http.get<Friend>(this.apiBaseURL + '/friends/' + id).pipe(map(res => {
      return res;
    }));
  };

  updateFriendRequest(updatedRequest: any) {
    return this.http.put(this.apiBaseURL + '/friends/' + updatedRequest.id, updatedRequest).pipe(res => {
      return res;
    });
  };
}
