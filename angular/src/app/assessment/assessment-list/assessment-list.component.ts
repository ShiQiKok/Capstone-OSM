import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { Assessment } from 'src/models/assessment';
import { AssessmentService } from 'src/services/assessment.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-assessment-list',
    templateUrl: './assessment-list.component.html',
    styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent extends AppComponent implements OnInit {
    isCreatingAssessment: boolean = false;
    assessmentList: Assessment[] = [];

    constructor(
        private _assessmentService: AssessmentService,
        router: Router,
        authenticationService: AuthenticationService,
        private modalService: NgbModal
    ) {
        super(router, authenticationService);
    }

    async ngOnInit() {
        await this.getApi();
        await this.getAll();
    }

    async getApi() {
        await this._assessmentService.getApi();
    }

    async getAll() {
        this.assessmentList = (await this._assessmentService.getAll(
            this.currentUser.id
        )) as Assessment[];
    }

    createAssessment() {
        this.isCreatingAssessment = true;
    }

    open(content: any) {
        this.modalService.open(content, {
            backdrop: 'static',
            size: 'lg',
            scrollable: true,
        });
    }

    // onSubmit() {
    //     console.log(this.assessmentDetailFormGroup.value);
    // }
}
