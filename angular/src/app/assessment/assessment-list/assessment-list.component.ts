import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { Assessment } from 'src/models/assessment';
import { Subject } from 'src/models/subject';
import { AssessmentService } from 'src/services/assessment.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from 'src/services/subject.service';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { AnswerScript } from 'src/models/answerScript';

@Component({
    selector: 'app-assessment-list',
    templateUrl: './assessment-list.component.html',
    styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent extends AppComponent implements OnInit {
    isLoading: boolean = true;
    isCreatingAssessment: boolean = false;
    subjects: Subject[] = [];
    assessmentList: Assessment[] = [];

    assessments: any = {};

    constructor(
        router: Router,
        authenticationService: AuthenticationService,
        private _assessmentService: AssessmentService,
        private _answerScriptService: AnswerScriptService,
        private _subjectService: SubjectService,
        private modalService: NgbModal
    ) {
        super(router, authenticationService);
    }

    async ngOnInit() {
        this.isLoading = true;
        await this.getApi();
        await this.getAll();
        this.mapAssessment();
        this.isLoading = false;
    }

    private async getApi() {
        await this._subjectService.getApi();
        await this._assessmentService.getApi();
        await this._answerScriptService.getApi();
    }

    private async getAll() {
        this.subjects = (await this._subjectService.getAll(
            this.currentUser.id
        )) as Subject[];
        this.assessmentList = (await this._assessmentService.getAll(
            this.currentUser.id
        )) as Assessment[];
    }

    async calculateProgress(assessmentId: any) {
        //     let total = answerScripts.length;
        //     let finished = answerScripts.filter(
        //         (x: any) => x.status === 'Finished'
        //     ).length;
        //     return Math.floor(finished / total * 100);
        // });
        // console.log(list);
        return 75;
    }

    private async mapAssessment() {
        this.subjects.forEach((subject) => {
            let list: any = this.assessmentList.filter(
                (assessment) => assessment.subject == subject.id
            );
            list.forEach(async (a: any) => {
                let answers: any = await this._answerScriptService.getAll(a.id);
                let finish = answers.filter(
                    (a: AnswerScript) => a.status === 'Finished'
                );
                let total = answers.length;
                a.progress = Math.floor((finish.length / total) * 100);
            });

            this.assessments[subject.id] = list;
        });
    }

    getSubjectName(id: number) {
        return this.subjects.find((subject) => subject.id == id)?.name;
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
}
