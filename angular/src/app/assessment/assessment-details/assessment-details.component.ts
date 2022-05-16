import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AssessmentService } from 'src/services/assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Assessment, AssessmentType } from 'src/models/assessment';
import { MarkingSettings } from 'src/models/assessment';
import { AnswerScriptService } from 'src/services/answer-script.service';
import {
    NgbActiveModal,
    NgbModal,
    NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { SelectionModel } from '@angular/cdk/collections';
import { AnswerScript } from 'src/models/answerScript';
import { GradebookService } from 'src/services/gradebook.service';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { RubricsInputComponent } from 'src/app/shared-component/rubrics-input/rubrics-input.component';
import { QuestionInputComponent } from 'src/app/shared-component/question-input/question-input.component';

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
    newAssessmentName!: string;

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
        this.newAssessmentName = this.assessment.name!;
    }

    printObject() {
        console.log(this.assessment.rubrics);
    }

    calculateProgress() {
        this.finished = this.answerScripts.filter(
            (x: any) => x.status === 'Finished'
        ).length;
        return Math.floor((this.finished / this.answerScripts.length) * 100);
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

    openModal(content: any, config: any) {
        if (config) this.modalService.open(content, config);
        else this.modalService.open(content, { size: 'lg' });
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

    saveEditedRubrics(
        rubricsInput: RubricsInputComponent,
        modal: NgbActiveModal
    ) {
        rubricsInput.rubricsChange.emit(rubricsInput.rubrics);
        this._assessmentService
            .update(this.assessment.id!, this.assessment)
            .then(() => {
                modal.close();
            });
    }

    saveEditedQuestions(
        questionsInput: QuestionInputComponent,
        modal: NgbActiveModal
    ) {
        questionsInput.questionsChange.emit(questionsInput.questions);
        this._assessmentService
            .update(this.assessment.id!, this.assessment)
            .then(() => {
                modal.close();
            });
    }

    onSave() {
        this.assessment.name = this.newAssessmentName;
        this._assessmentService
            .update(this.assessment.id!, this.assessment)
            .then(() => {
                this.modalService.dismissAll();
            });
    }
}
