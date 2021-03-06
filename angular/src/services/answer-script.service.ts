import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/base.service';

@Injectable({
    providedIn: 'root',
})
export class AnswerScriptService extends BaseService {
    constructor(http: HttpClient) {
        super(http);
        this.ROOT = this.ROOT + 'answers/';
    }

    update(id: number, data: any) {
        return new Promise<Object>((resolve, reject) => {
            this.http
                .post(`${this.ROOT}${this.ALL_API.update}${id}/`, data, {})
                .subscribe((obj) => resolve(obj));
        });
    }

    bulkUpload(assessmentId: number, file: File) {
        return new Promise<Object>((resolve, reject) => {
            const formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('assessmentId', assessmentId.toString());
            this.http.post(this.ROOT + this.ALL_API.bulkCreate, formData).subscribe(
                (list) => resolve(list),
                (err) => reject(err)
            );
        });
    }
}
