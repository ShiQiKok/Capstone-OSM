import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Assessment } from 'src/models/assessment';
import { AssessmentService } from 'src/services/assessment.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { SubjectService } from 'src/services/subject.service';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { AnswerScript, AnswerScriptStatusObj } from 'src/models/answerScript';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-assessment-list',
    templateUrl: './assessment-list.component.html',
    styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent extends AppComponent implements OnInit {
    // controls
    isLoading: boolean = true;

    // object
    subjects: any = {};
    assessmentList: Assessment[] = [];
    assessments?: any;

    // icon
    faPlus = faPlus;

    constructor(
        router: Router,
        authenticationService: AuthenticationService,
        private _assessmentService: AssessmentService,
        private _answerScriptService: AnswerScriptService,
        private _subjectService: SubjectService
    ) {
        super(router, authenticationService);
    }

    async ngOnInit() {
        this.isLoading = true;
        await this.getApi();
        await this.getAssessments();
        this.mapAssessment();
        setTimeout(() => {
            this.isLoading = false;
        }, 1000);
    }

    /** To get all APIs for each service */
    private async getApi() {
        await this._subjectService.getApi();
        await this._assessmentService.getApi();
        await this._answerScriptService.getApi();
    }

    /** To load the assessments that is under the current user */
    private async getAssessments() {
        this.assessmentList = (await this._assessmentService.getAll(
            this.currentUser.id!
        )) as Assessment[];
    }

    /** To create a object for front-end presentation, which maps the assessments with their subject ids */
    private mapAssessment(): void {
        if (this.assessmentList.length > 0){
            this.assessments = {}
            this.assessmentList.forEach(async (assessment: any) => {
                this._answerScriptService.getAll(assessment.id!).then((obj) => {
                    let answers = obj as AnswerScript[];

                    let finish = answers.filter((a: AnswerScript) => {
                        let j = a.status!.findIndex(
                            (s: AnswerScriptStatusObj) => {
                                return s.marker === this.currentUser.id;
                            }
                        );
                        return a.status![j].status == 'Finished';
                    });
                    let total = answers.length;
                    assessment.progress = Math.floor((finish.length / total) * 100);
                });
                if (this.assessments[assessment.subject] != undefined) {
                    this.assessments[assessment.subject].push(assessment);
                } else {
                    this.assessments[assessment.subject] = [assessment];
                    let s = await this._subjectService.get(assessment.subject);
                    this.subjects[assessment.subject] = s.name;
                }
            });
        }
    }
}
