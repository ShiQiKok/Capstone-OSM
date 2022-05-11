import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AssessmentService } from 'src/services/assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Assessment, AssessmentType } from 'src/models/assessment';
import { MarkingSettings } from 'src/models/assessment';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { SelectionModel } from '@angular/cdk/collections';
import { AnswerScript } from 'src/models/answerScript';
import { GradebookService } from 'src/services/gradebook.service';
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-assessment-details',
    templateUrl: './assessment-details.component.html',
    styleUrls: ['./assessment-details.component.scss'],
})
export class AssessmentDetailsComponent implements OnInit {
    // objects
    assessment!: Assessment;
    answerScripts: any = undefined;
    uploadedFile!: File | null;
    markingSettings: MarkingSettings[] = Object.values(MarkingSettings);
    selection = new SelectionModel<AnswerScript>(false, []);
    assessmentTypes: AssessmentType[] = Object.values(AssessmentType);
    finished: number = 0;

    // icons
    faUpload = faUpload;
    faCog = faCog;

    // controls
    isLoading: boolean = true;
    isSubmitDisabled: boolean = true;

    // table headers
    displayedColumns: string[] = [
        'studentName',
        'studentId',
        'lastUpdate',
        'status',
        'marks',
    ];

    constructor(
        private _assessmentService: AssessmentService,
        private _answerScriptService: AnswerScriptService,
        private _gradebookService: GradebookService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal
    ) {}

    async ngOnInit() {
        this.isLoading = true;
        await this._assessmentService.getApi();
        await this._answerScriptService.getApi();
        await this.getAssessmentDetails();
        this.answerScripts = await this._answerScriptService.getAll(
            this.assessment.id!
        );
        this.calculateProgress();
        this.isLoading = false;
    }

    async getAssessmentDetails() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.assessment = (await this._assessmentService.get(id)) as Assessment;
    }

    calculateProgress() {
        this.finished = this.answerScripts.filter(
            (x: any) => x.status === 'Finished'
        ).length;
        return Math.floor(this.finished / this.answerScripts.length * 100);
    }

    updateAssessment(id: any) {
        this._assessmentService
            .update(id, this.assessment)
            .then((assessment: any) => {
                this.assessment = assessment;
            });
    }

    deleteAssessment(id: any) {
        this._assessmentService.delete(id).then(() => {
            this.router.navigate(['/assessment-list']);
        });
    }

    openModal(content: any) {
        this.modalService.open(content, { size: 'lg' });
    }

    onFileChange(file: FileList) {
        this.uploadedFile = file.item(0);
        this.isSubmitDisabled = false;
    }

    bulkUpload() {
        this._answerScriptService
            .bulkUpload(this.assessment.id!, this.uploadedFile!)
            .then(() => {
                this._answerScriptService
                    .getAll(this.assessment.id!)
                    .then((obj) => {
                        this.answerScripts = obj;
                        this.modalService.dismissAll();
                    });
            });
    }

    onRowSelect(answerScript: AnswerScript) {
        this.selection.toggle(answerScript);
    }

    downloadGradebook() {
        this._gradebookService.downloadGradebook(
            this.assessment.id!,
            `Gradebook - ${this.assessment.name}`
        );
    }
}
