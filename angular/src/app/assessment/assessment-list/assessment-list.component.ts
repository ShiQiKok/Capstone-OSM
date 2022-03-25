import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Assessment } from 'src/models/assessment';
import { AssessmentService } from 'src/services/assessment.service';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
    selector: 'app-assessment-list',
    templateUrl: './assessment-list.component.html',
    styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent extends AppComponent implements OnInit {

    assessmentList : Assessment[] = [];

    constructor(private _assessmentService: AssessmentService, router: Router, authenticationService: AuthenticationService) {
        super(router, authenticationService);
    }

    async ngOnInit() {
        await this.getApi();
        await this.getAll();
    }

    async getApi() {
        await this._assessmentService.getApi();
        // console.log(this._assessmentService.ALL_API);
    }

    getAll() {
        this._assessmentService.getAll(this.currentUser.id).then((list: any) => {
            this.assessmentList = list;
            // list.forEach((assessment: Assessment) => {
            //     console.log(assessment);
            // });
        });
    }
}
