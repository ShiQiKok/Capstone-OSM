import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private httpOptions: any;

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem('currentUser') || '{}')
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    async login(username: string, password: string) {
        return new Promise((resolve, reject) => {
            this.http
                .post<any>(
                    '/api/token/',
                    {
                        username,
                        password,
                    },
                    this.httpOptions
                )
                .subscribe(
                    async (token) => {
                        let data = await this.updateData(token);
                        let user: User = JSON.parse(JSON.stringify(data));
                        user['token'] = token;
                        // console.log('user_object');
                        // console.log(user);
                        localStorage.setItem(
                            'currentUser',
                            JSON.stringify(user)
                        );
                        this.currentUserSubject.next(user);
                        resolve(user);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next({} as User);
    }

    // this function returns a JSON-like User object
    private updateData(token: any) {
        return new Promise((resolve, reject) => {
            // decode the token to read the username and expiration timestamp
            const token_parts = token['access'].split(/\./);
            const token_decoded = JSON.parse(window.atob(token_parts[1]));
            let token_expires = new Date(token_decoded.exp * 1000);

            let user_id = token_decoded.user_id;
            this.http
                .get('api/users/user-details/' + user_id)
                .subscribe((data) => {
                    resolve(data);
                });
        });
    }
}
