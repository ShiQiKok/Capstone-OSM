import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<User[]>('api/users/users');
    }

    signup(user: User) {
        return this.http.post(`api/users/user-create`, user);
    }

    delete(id: number) {
        return this.http.delete(`api/user/user-delete/${id}`);
    }
}
