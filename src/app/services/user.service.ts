import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user'
import { environment } from 'src/environments/environment';
import { HeaderService } from './header.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })

export class UserService {
    apiBaseURL: string = environment.apiUrl + '/';

    constructor(
        private http: HttpClient,
        private header: HeaderService,
        private toastService: ToastService
    ) { }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    getUserByEmail(email: any) {
        return this.http.post(`${environment.apiUrl}/users/finduserbyemail`, { email: email });
    }

    getUserById(userId: String): any {
        return this.http.get(`${environment.apiUrl}/users/${userId}`).pipe(res => {
            return res;
        });
    };

    updateUserPhoto(updatedUser: any) {
        return this.http.post(this.apiBaseURL + 'users/updateuserphotoId', updatedUser, this.header.requestHeaders()).pipe(res => {
            this.toastService.success('Image Uploaded Successfully');
            return res;
        });
    };

    updateUser(updatedUser: any) {
        return this.http.put(this.apiBaseURL + 'users/' + updatedUser.id, updatedUser).pipe(res => {
            this.toastService.success('Details Updated Successfully');
            return res;
        });
    };

}