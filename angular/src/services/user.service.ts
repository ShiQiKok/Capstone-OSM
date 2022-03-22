import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    rootUrl = 'api/users/';
    subUrl: any = null;

    constructor(private http: HttpClient) {
        this.loadSubUrl();
    }

    private loadSubUrl() {
        this.http.get(this.rootUrl).subscribe((data) => {
            this.subUrl = data;
            console.log(this.subUrl);
        });
    }

    users() {
        return this.http.get(this.rootUrl + this.subUrl['getAll']);
    }
}
