import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/services/assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Assessment, AssessmentType } from 'src/models/assessment';
import { MarkingSettings } from 'src/models/assessment';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faFileDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { SelectionModel } from '@angular/cdk/collections';
import { AnswerScript, AnswerScriptStatusObj } from 'src/models/answerScript';
import { GradebookService } from 'src/services/gradebook.service';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { RubricsInputComponent } from 'src/app/shared-component/rubrics-input/rubrics-input.component';
import { QuestionInputComponent } from 'src/app/shared-component/question-input/question-input.component';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { User } from 'src/models/user';

@Component({
    selector: 'app-assessment-details',
    templateUrl: './assessment-details.component.html',
    styleUrls: ['./assessment-details.component.scss'],
})
export class AssessmentDetailsComponent extends AppComponent implements OnInit {
    // objects
    assessment!: Assessment;
    answerScripts!: MatTableDataSource<AnswerScript>;
    uploadedFile!: File | null;
    markingSettings: MarkingSettings[] = Object.values(MarkingSettings);
    selection = new SelectionModel<AnswerScript>(false, []);
    assessmentTypes: AssessmentType[] = Object.values(AssessmentType);
    finished: number = 0;
    newAssessmentName!: string;
    markerIndex!: number;
    collaborators!: User[];

    // icons
    faUpload = faUpload;
    faCog = faCog;
    faArrowAltCircleLeft = faArrowAltCircleLeft;
    faFileDownload = faFileDownload;

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
        router: Router,
        _authenticationService: AuthenticationService,
        private _assessmentService: AssessmentService,
        private _answerScriptService: AnswerScriptService,
        private _gradebookService: GradebookService,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private _snackBar: MatSnackBar
    ) {
        super(router, _authenticationService);
    }

    async ngOnInit() {
        this.isLoading = true;
        await this._assessmentService.getApi();
        await this._answerScriptService.getApi();
        await this.getAssessmentDetails();
        this.answerScripts = new MatTableDataSource(
            (await this._answerScriptService.getAll(
                this.assessment.id!
            )) as AnswerScript[]
        );

        if (this.answerScripts.data.length > 0) {
            this.updateMatchedMarkerIndex();
        }
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
        this.finished = this.answerScripts.data.filter(
            (answer: AnswerScript) => {
                let j = answer.status!.findIndex((s: AnswerScriptStatusObj) => {
                    return s.marker === this.currentUser.id;
                });
                return answer.status![j].status == 'Finished';
            }
        ).length;
        return Math.floor(
            (this.finished / this.answerScripts.data.length) * 100
        );
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
            this.modalService.dismissAll();
            this.router.navigate(['/assessment-list']);
            this._snackBar.open('The assessment is deleted!', 'ok', {
                duration: 3000,
            });
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
                        this.answerScripts = new MatTableDataSource(
                            obj as AnswerScript[]
                        );
                        console.log(this.answerScripts);
                        this.updateMatchedMarkerIndex();
                        this.modalService.dismissAll();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
    }

    private updateMatchedMarkerIndex() {
        this.markerIndex = this.answerScripts.data[0].marks.findIndex(
            (obj: any) => {
                return obj.markerId === this.currentUser.id;
            }
        );
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

    filterValue(event: Event) {
        let value = (event.target as HTMLInputElement).value;
        this.answerScripts.filter = value.trim().toLowerCase();
    }
}
