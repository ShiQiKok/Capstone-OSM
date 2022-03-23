import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    rootUrl = 'api/users/';
    subUrl: any = null;
    private httpOptions: any;
    token!: string;
    token_expires!: Date;
    errors: any = [];
    username!: string;
    user_id: any;

    constructor(private http: HttpClient) {
        this.loadSubUrl();
    }

    private loadSubUrl() {
        // this.http.get(this.rootUrl).subscribe((data) => {
        //     this.subUrl = data;
        //     console.log(this.subUrl);
        // });
        this.httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
    }

    users() {
        return this.http.get(this.rootUrl + 'users/');
    }

    login(user: any) {
        return new Promise((resolve, reject) => {
            this.http
                .post('/api/token/', JSON.stringify(user), this.httpOptions)
                .subscribe(
                    (data: any) => {
                        this.updateData(data['access']).then((data) => {
                            resolve(data);
                        });
                    },
                    (err) => {
                        this.errors = err['error'];
                        reject(err);
                    }
                );
        });
    }

    private updateData(token: any) {
        return new Promise((resolve, reject) => {
            this.token = token;
            this.errors = [];

            // decode the token to read the username and expiration timestamp
            const token_parts = this.token.split(/\./);
            const token_decoded = JSON.parse(window.atob(token_parts[1]));
            this.token_expires = new Date(token_decoded.exp * 1000);
            this.user_id = token_decoded.user_id;
            this.http
                .get(this.rootUrl + 'user-details/' + this.user_id)
                .subscribe((data: any) => {
                    this.username = data.username;
                    resolve(data);
                });
        });
    }
}
