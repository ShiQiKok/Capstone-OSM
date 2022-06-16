import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/base.service';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseService {
    constructor(http: HttpClient) {
        super(http);
        this.ROOT = this.ROOT + 'users/';
    }

    checkPassword(userId: number, password: string, newPassword: string) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .post(this.ROOT + this.ALL_API.checkPassword + userId, {
                    currentPassword: password,
                    newPassword: newPassword,
                })
                .subscribe(
                    (obj) => resolve(obj),
                    (err) => reject(err)
                );
        });
    }

    checkEmail(email: string) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .post(this.ROOT + this.ALL_API.checkEmail, {
                    email: email,
                })
                .subscribe(
                    (obj) => resolve(obj),
                    (err) => reject(err)
                );
        });
    }

    resetPassword(uid: string, token: string, newPassword: string) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .post(`${this.ROOT}${this.ALL_API.resetPassword}${uid}/${token}`, {
                    newPassword: newPassword,
                })
                .subscribe(
                    (obj) => resolve(obj),
                    (err) => reject(err)
                );
        });
    }

    getCollabUser() {
        return new Promise<any>((resolve, reject) => {
            this.http.get(this.ROOT + this.ALL_API.collab).subscribe(
                (obj) => resolve(obj),
                (err) => reject(err)
            );
        });
    }

    getBy(obj: any) {
        return new Promise<any>((resolve, reject) => {
            this.http
                .post(this.ROOT + this.ALL_API.getBy, { data: obj })
                .subscribe(
                    (obj) => resolve(obj),
                    (err) => reject(err)
                );
        });
    }

    getList(obj: any) {
        return new Promise<any>((resolve, reject) => {
            this.http
                .post(this.ROOT + this.ALL_API.getList, { list: obj })
                .subscribe(
                    (obj) => resolve(obj),
                    (err) => reject(err)
                );
        });
    }
}
