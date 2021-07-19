import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user'
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    isUserAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
    isUserAdmin = new BehaviorSubject<boolean>(this.hasAdmin()!);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    private hasToken(): boolean {
        return !!localStorage.getItem('currentUser');
    }

    isUserLoggedIn(): Observable<boolean> {
        return this.isUserAuthenticated.asObservable();
    }

    private hasAdmin(): boolean | undefined {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser')!).isAdmin;
        }
        return;
    }

    isAdmin(): Observable<boolean> {
        return this.isUserAdmin.asObservable();
    }

    getToken() {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser')!).token;
        }
        return;
    }

    getDecodedToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }

    getTokenExpirationDate(token: string) {
        const decodedToken = this.getDecodedToken(token);
        console.log('Token : ', decodedToken);
        if (decodedToken.exp === undefined) return null;
        const date = new Date(0);
        date.setUTCSeconds(decodedToken.exp);
        console.log('Token Expiration Time: ', date);
        return date;
    }

    isTokenExpired(): boolean {
        var token = this.getToken();
        if (!token) return true;

        const date: any = this.getTokenExpirationDate(token);
        if (date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

    login(email: any, password: any) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('currentUserPhotoId', user.photoId);
                this.isUserAuthenticated.next(true);
                this.currentUserSubject.next(user);
                this.isUserAdmin.next(user.isAdmin);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.clear();
        this.isUserAuthenticated.next(false);
        this.isUserAdmin.next(false);
        this.currentUserSubject.next(null!);
        this.router.navigate(['/login']);
    }
}