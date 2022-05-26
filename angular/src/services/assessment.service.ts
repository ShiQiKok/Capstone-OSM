import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/base.service';

@Injectable({
    providedIn: 'root',
})
export class AssessmentService extends BaseService {
    constructor(http: HttpClient) {
        super(http);
        this.ROOT = this.ROOT + 'assessments/';
    }

    uploadRubrics(file: File) {
        return new Promise<Object>((resolve, reject) => {
            const formData: FormData = new FormData();
            formData.append('file', file, file.name);
            this.http
                .post(`${this.ROOT}${this.ALL_API.uploadRubrics}`, formData, {})
                .subscribe(
                    (obj) => resolve(obj),
                    (err) => reject(err)
                );
        });
    }

    uploadQuestions(file: File) {
        return new Promise<Object>((resolve, reject) => {
            const formData: FormData = new FormData();
            formData.append('file', file, file.name);
            this.http
                .post(`${this.ROOT}${this.ALL_API.uploadQuestions}`, formData, {})
                .subscribe(
                    (obj) => resolve(obj),
                    (err) => reject(err)
                );
        });
    }
}
