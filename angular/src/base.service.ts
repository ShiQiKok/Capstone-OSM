import { HttpClient } from '@angular/common/http';

export class BaseService {
    ROOT = 'api/';

    ALL_API!: any;

    constructor(private http: HttpClient) {}

    getApi() {
        return new Promise<Object>((resolve, reject) => {
            this.http.get(this.ROOT).subscribe((api) => {
                this.ALL_API = api;
                resolve(this.ALL_API);
            });
        });
    }

    getAll() {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .get(this.ROOT + this.ALL_API.getAll)
                .subscribe((list) => resolve(list));
        });
    }

    get(id: number) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .get(this.ROOT + this.ALL_API.get + id)
                .subscribe((list) => resolve(list));
        });
    }
}
