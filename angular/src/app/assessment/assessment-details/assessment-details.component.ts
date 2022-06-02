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
import {
    faArrowAltCircleLeft,
    faTimesCircle,
} from '@fortawesome/free-regular-svg-icons';
import { UserService } from 'src/services/user.service';
import { UserCollabInfo } from 'src/models/user';

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
    collaborators!: UserCollabInfo[];
    totalMarks: number = 0;

    // icons
    faUpload = faUpload;
    faCog = faCog;
    faArrowAltCircleLeft = faArrowAltCircleLeft;
    faFileDownload = faFileDownload;
    faTimesCircle = faTimesCircle;

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
        private _userService: UserService,
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
        await this._userService.getApi();
        await this.getAssessmentDetails();
        this.calculateTotalMarks();
        this.answerScripts = new MatTableDataSource(
            (await this._answerScriptService.getAll(
                this.assessment.id!
            )) as AnswerScript[]
        );

        // set the MatTableDataSource's filterPredicate to custom filter function
        this.answerScripts.filterPredicate = (data: any, filter: string) => {
            // Transform the data into a lowercase string of all property values.
            const dataStr = Object.keys(data)
                .reduce((currentTerm, key) => {
                    let temp = data[key];

                    if (key === 'status') {
                        temp = temp[this.markerIndex].status;
                    } else if (key === 'marks') {
                        temp = temp[this.markerIndex].totalMark;
                    }
                    // Use an obscure Unicode character to delimit the words in the concatenated string.
                    // This avoids matches where the values of two columns combined will match the user's query
                    // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
                    // that has a very low chance of being typed in by somebody in a text field. This one in
                    // particular is "White up-pointing triangle with dot" from
                    // https://en.wikipedia.org/wiki/List_of_Unicode_characters
                    return currentTerm + temp + '◬';
                }, '')
                .toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) != -1;
        };

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
        this.loadCollaborators();
    }

    loadCollaborators() {
        this._userService
            .getList(this.assessment.markers)
            .then((arr) => {
                arr = arr.filter((m: any) => m.id !== this.currentUser.id);
                this.collaborators = arr;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    private calculateTotalMarks() {
        if (this.assessment.type == AssessmentType.ESSAY_BASED) {
            this.totalMarks = this.assessment.rubrics.totalMarks;
        } else {
            this.assessment.questions!.forEach((q: any) => {
                this.totalMarks += q.value.marks;
            });
        }
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
        this.assessment.markers = this.collaborators.map((c: any) => {
            return c.id;
        });
        this.assessment.markers.push(this.currentUser.id!);
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

    removeCollaborator(user: UserCollabInfo) {
        this.collaborators = this.collaborators.filter((c) => c != user);
    }

    onEnterPressed(inputElement: any) {
        let inputValue = inputElement.value;
        let msgElement = document.querySelector('#collaborationMsg')!;
        msgElement.innerHTML = '';
        inputElement.value = '';

        this._userService
            .getBy(inputValue)
            .then((obj: UserCollabInfo) => {
                if (
                    !this.collaborators.some(
                        (c) => JSON.stringify(c) == JSON.stringify(obj)
                    ) &&
                    obj.id != this.currentUser.id
                ) {
                    this.collaborators.push(obj);
                } else {
                    msgElement.innerHTML = 'This user is already added!';
                }
            })
            .catch(() => {
                msgElement.innerHTML =
                    'User not found! Please make sure you have entered the correct email or username.';
            });
    }
}
