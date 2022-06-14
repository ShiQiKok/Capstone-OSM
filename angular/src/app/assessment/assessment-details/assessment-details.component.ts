import { Component, OnInit, ViewChild } from '@angular/core';
import { AssessmentService } from 'src/services/assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Assessment, AssessmentType, GradingMethod } from 'src/models/assessment';
import { MarkingSettings } from 'src/models/assessment';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faFileDownload, faInfo, faUpload } from '@fortawesome/free-solid-svg-icons';
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
    faEdit,
    faTimesCircle,
} from '@fortawesome/free-regular-svg-icons';
import { UserService } from 'src/services/user.service';
import { UserCollabInfo } from 'src/models/user';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-assessment-details',
    templateUrl: './assessment-details.component.html',
    styleUrls: ['./assessment-details.component.scss'],
})
export class AssessmentDetailsComponent extends AppComponent implements OnInit {
    private sort!: MatSort;

    @ViewChild(MatSort) set setSort(sort: MatSort) {
        if (sort) {
            this.sort = sort;
            this.answerScripts.sort = this.sort;
        }
    }

    // objects
    assessment!: Assessment;
    editAssessment!: Assessment;
    answerScripts!: MatTableDataSource<AnswerScript>;
    uploadedFile!: File | null;
    markingSettings: MarkingSettings[] = Object.values(MarkingSettings);
    selection = new SelectionModel<AnswerScript>(false, []);
    assessmentTypes: AssessmentType[] = Object.values(AssessmentType);
    gradingMethods: GradingMethod[] = Object.values(GradingMethod);
    finished: number = 0;
    markerIndex!: number;
    collaborators!: UserCollabInfo[];
    totalMarks: number = 0;
    uploadErrorMsg: string = '';

    // icons
    faUpload = faUpload;
    faCog = faCog;
    faArrowAltCircleLeft = faArrowAltCircleLeft;
    faFileDownload = faFileDownload;
    faTimesCircle = faTimesCircle;
    faEdit = faEdit;
    faInfo = faInfo;

    // controls
    isLoading: boolean = true;

    // table headers
    displayedColumns: string[] = [
        'studentName',
        'studentId',
        'lastUpdate',
        'status',
        'marks',
        'action'
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

        if (this.answerScripts.data.length > 0) {
            this.updateMatchedMarkerIndex();
        }
        this.calculateProgress();
        this.setFilteringProperties();
        this.setSortingProperties();
        this.isLoading = false;
    }

    /**
     * set the MatTableDataSource's filterPredicate to custom filter function
     */
    private setFilteringProperties() {
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
                    return currentTerm + temp + '◬';
                }, '')
                .toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) != -1;
        };
    }

    /**
     * To update the custom sorting properties of the table
     */
    private setSortingProperties() {
        const STATUS_SORTING = ['In Progress', 'Not Started', 'Finished'];

        this.answerScripts.sort = this.sort;

        // set the sorting function to custom filter function
        this.answerScripts.sortData = (data, sort) => {
            const active = sort.active;
            const direction = sort.direction;
            if (!active || direction == '') {
                return data;
            }

            let processedActive = active;

            switch (active) {
                case 'studentName':
                    processedActive = 'student_name';
                    break;
                case 'studentId':
                    processedActive = 'student_id';
                    break;
                case 'lastUpdate':
                    processedActive = 'date_updated';
                    break;
            }

            return data.sort((a, b) => {
                let tempDataA: any = Object.assign({}, a);
                let tempDataB: any = Object.assign({}, b);

                if (processedActive == 'status' && a.status && b.status) {
                    let statusA = a.status[this.markerIndex].status;
                    let statusB = b.status[this.markerIndex].status;
                    tempDataA.status = STATUS_SORTING.indexOf(statusA);
                    tempDataB.status = STATUS_SORTING.indexOf(statusB);
                } else if (processedActive == 'marks' && a.marks && b.marks) {
                    tempDataA.marks = a.marks[this.markerIndex].totalMark;
                    tempDataB.marks = b.marks[this.markerIndex].totalMark;
                }

                let valueA = this.answerScripts.sortingDataAccessor(
                    tempDataA,
                    processedActive
                );
                let valueB = this.answerScripts.sortingDataAccessor(
                    tempDataB,
                    processedActive
                );

                // If there are data in the column that can be converted to a number,
                // it must be ensured that the rest of the data
                // is of the same type so as not to order incorrectly.
                const valueAType = typeof valueA;
                const valueBType = typeof valueB;
                if (valueAType !== valueBType) {
                    if (valueAType === 'number') {
                        valueA += '';
                    }
                    if (valueBType === 'number') {
                        valueB += '';
                    }
                }
                // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
                // one value exists while the other doesn't. In this case, existing value should come last.
                // This avoids inconsistent results when comparing values to undefined/null.
                // If neither value exists, return 0 (equal).
                let comparatorResult = 0;
                if (valueA != null && valueB != null) {
                    // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
                    if (valueA > valueB) {
                        comparatorResult = 1;
                    } else if (valueA < valueB) {
                        comparatorResult = -1;
                    }
                } else if (valueA != null) {
                    comparatorResult = 1;
                } else if (valueB != null) {
                    comparatorResult = -1;
                }
                return comparatorResult * (direction == 'asc' ? 1 : -1);
            });
        };
    }

    async getAssessmentDetails() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.assessment = (await this._assessmentService.get(id)) as Assessment;
        this.editAssessment = Object.assign({}, this.assessment);
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
        if (this.assessment.grading_method == GradingMethod.RUBRICS) {
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
                        this.uploadedFile = null;
                        this.updateMatchedMarkerIndex();
                        this.modalService.dismissAll();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }).catch((err) => {
                this.uploadErrorMsg = err.error.error
            })
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
        modal.close();
    }

    saveEditedQuestions(
        questionsInput: QuestionInputComponent,
        modal: NgbActiveModal
    ) {
        questionsInput.questionsChange.emit(questionsInput.questions);
        modal.close();
    }

    onSave() {
        this.assessment = Object.assign({}, this.editAssessment);
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
