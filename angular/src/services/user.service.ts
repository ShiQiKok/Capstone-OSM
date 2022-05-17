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

    signup(user: User) {
        return new Promise<Object>((resolve, reject) => {
            this.http.post(this.ROOT + this.ALL_API.create, user).subscribe(
                (obj) => resolve(obj),
                (err) => reject(err)
            );
        });
    }

    checkPassword(userId: number, password: string, newPassword: string) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .post(this.ROOT + this.ALL_API.check + userId, {
                    currentPassword: password,
                    newPassword: newPassword,
                })
                .subscribe(
                    (obj) => resolve(obj),
                    (err) => reject(err)
                );
        });
    }
}
