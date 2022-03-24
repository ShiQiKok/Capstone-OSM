import { Component, OnInit } from '@angular/core';
import { Assessment } from 'src/models/assessment';
import { AssessmentService } from 'src/services/assessment.service';

@Component({
    selector: 'app-assessment-list',
    templateUrl: './assessment-list.component.html',
    styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent implements OnInit {

    assessmentList : Assessment[] = [];

    constructor(private _assessmentService: AssessmentService) {}

    async ngOnInit() {
        await this.getApi();
        await this.getAll();
    }

    async getApi() {
        await this._assessmentService.getApi();
        // console.log(this._assessmentService.ALL_API);
    }

    getAll() {
        this._assessmentService.getAll().then((list: any) => {
            this.assessmentList = list;
            // list.forEach((assessment: Assessment) => {
            //     console.log(assessment);
            // });
        });
    }
}
