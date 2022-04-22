import { HttpClient } from '@angular/common/http';

export class BaseService {
    ROOT = 'api/';

    ALL_API!: any;

    constructor(public http: HttpClient) {}

    getApi() {
        return new Promise<Object>((resolve, reject) => {
            this.http.get(this.ROOT).subscribe((api) => {
                this.ALL_API = api;
                resolve(this.ALL_API);
            });
        });
    }

    getAll(userId: number) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .get(this.ROOT + this.ALL_API.getAll + userId)
                .subscribe((list) => resolve(list));
        });
    }

    get(id: number) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .get(this.ROOT + this.ALL_API.get + id)
                .subscribe((obj) => resolve(obj));
        });
    }

    create(object: any) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .post(this.ROOT + this.ALL_API.create, object)
                .subscribe((list) => resolve(list));
        });
    }

    update(id: number, data: any) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .post(`${this.ROOT}${this.ALL_API.update}${id}/`, data, {})
                .subscribe((list) => resolve(list));
        });
    }

    delete(id: number) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .delete(`${this.ROOT}${this.ALL_API.delete}${id}/`, {})
                .subscribe(() => resolve('successfully deleted!'));
        });
    }
}
