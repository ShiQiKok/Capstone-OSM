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
}
