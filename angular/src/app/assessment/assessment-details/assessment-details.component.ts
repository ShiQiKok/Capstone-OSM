import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/services/assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Assessment } from 'src/models/assessment';

@Component({
    selector: 'app-assessment-details',
    templateUrl: './assessment-details.component.html',
    styleUrls: ['./assessment-details.component.scss'],
})
export class AssessmentDetailsComponent implements OnInit {
    assessment!: Assessment;

    constructor(
        private _assessmentService: AssessmentService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    async ngOnInit() {
        await this._assessmentService.getApi();
        this.getAssessmentDetails();
    }

    getAssessmentDetails() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this._assessmentService.get(id).then((assessment: any) => {
            this.assessment = assessment;
        });
    }

    // TODO: test
    updateAssessment(id: number) {
        this._assessmentService.update(id).then((assessment: any) => {
            this.assessment = assessment;
        });
    }

    deleteAssessment(id: number) {
        this._assessmentService.delete(id).then((data) => {
            this.router.navigate(['/assessment-list']);
        });
    }
}
