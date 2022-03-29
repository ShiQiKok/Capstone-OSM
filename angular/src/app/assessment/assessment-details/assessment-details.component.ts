import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/services/assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Assessment } from 'src/models/assessment';
import { MarkingSettings } from 'src/models/assessment';
import { AnswerScriptService } from 'src/services/answer-script.service';

@Component({
    selector: 'app-assessment-details',
    templateUrl: './assessment-details.component.html',
    styleUrls: ['./assessment-details.component.scss'],
})
export class AssessmentDetailsComponent implements OnInit {
    assessment!: Assessment;

    isLoading: boolean = true;
    answerScripts: any = undefined;

    displayedColumns: string[] = ['studentName', 'studentId', 'lastUpdate', 'status', 'marks'];
    markingSettings: MarkingSettings[] = Object.values(MarkingSettings);

    constructor(
        private _assessmentService: AssessmentService,
        private _answerScriptService: AnswerScriptService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    async ngOnInit() {
        this.isLoading = true;
        await this._assessmentService.getApi();
        await this._answerScriptService.getApi();
        await this.getAssessmentDetails();
        this.answerScripts = await this._answerScriptService.getAll(this.assessment.id);
        console.log(this.answerScripts)
        this.isLoading = false;
    }

    async getAssessmentDetails() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.assessment = await this._assessmentService.get(id) as Assessment;
    }

    updateAssessment(id: number) {
        this._assessmentService
            .update(id, this.assessment)
            .then((assessment: any) => {
                this.assessment = assessment;
            });
    }

    deleteAssessment(id: number) {
        this._assessmentService.delete(id).then(() => {
            this.router.navigate(['/assessment-list']);
        });
    }
}
