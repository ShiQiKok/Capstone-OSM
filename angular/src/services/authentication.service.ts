import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<User>;

    private httpOptions: any;

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        this.currentUserSubject = new BehaviorSubject<any>(
            localStorage.getItem('currentUser')
                ? JSON.parse(localStorage.getItem('currentUser') as string)
                : null
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
                        // set a dummy user to inject the JWT authentication header
                        this.currentUserSubject.next({
                            token: token,
                        });

                        // update the currentUser observable
                        let user = JSON.parse(
                            JSON.stringify(await this.updateData(token))
                        );
                        user['token'] = token;

                        // set current user in local storage
                        localStorage.setItem(
                            'currentUser',
                            JSON.stringify(user)
                        );

                        // assign the real user object to the currentUserSubject
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
        return new Promise((resolve, reject) => {
            // remove user from local storage and set current user to null
            localStorage.removeItem('currentUser');
            this.currentUserSubject.next(null);
            resolve('Successfully logged out!');
        });
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
                .get('api/users/user-details/' + user_id + '/')
                .subscribe((data) => {
                    resolve(data);
                });
        });
    }

    setUser(user: any){
        this.currentUserSubject.next(user);
        this.currentUser = this.currentUserSubject.asObservable();
        localStorage.setItem(
            'currentUser',
            JSON.stringify(user)
        );
    }
}
