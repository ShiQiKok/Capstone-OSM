import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import {
    Assessment,
    AssessmentType,
    MarkingSettings,
    Rubrics,
} from 'src/models/assessment';
import { AuthenticationService } from 'src/services/authentication.service';
import { SubjectService } from 'src/services/subject.service';
import { faTrashAlt, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { AssessmentService } from 'src/services/assessment.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RubricsInputComponent } from 'src/app/shared-component/rubrics-input/rubrics-input.component';

class QuestionInput {
    no?: string | undefined;
    value?: QuestionValueInput | undefined;
    isEdit?: boolean | undefined;

    constructor(no: string, value: QuestionValueInput, isEdit: boolean) {
        this.no = no;
        this.value = value;
        this.isEdit = isEdit;
    }
}

class QuestionValueInput {
    question?: string | undefined;
    marks?: number | undefined;
}

class RubricsInput {
    marksRange?: RubricMarkRangeInput[] | undefined;
    isEdit?: boolean | undefined; // control to edit marks range
    criterion?: RubricCriterionInput[] | undefined;
}

class RubricCriterionInput {
    title?: string | undefined;
    description?: string | undefined;
    totalMarks?: number | undefined;
    columns?: RubricColumnInput[] | undefined;
    isEdit?: boolean | undefined;
}

class RubricColumnInput {
    description?: string | undefined;
}

class RubricMarkRangeInput {
    min?: number | undefined;
    max?: number | undefined;
}

@Component({
    selector: 'app-assessment-creation-form',
    templateUrl: './assessment-creation-form.component.html',
})
export class AssessmentCreationFormComponent extends AppComponent {
    // Component Reference
    @ViewChild('rubricsInput') rubricsInput!: RubricsInputComponent;

    // icons
    faTrashAlt = faTrashAlt;
    faEllipsisV = faEllipsisV;

    isLoading: boolean = true;

    assessment?: Assessment;

    assessmentDetailFormGroup!: FormGroup;
    questionFormGroup!: FormGroup;
    subjectFormGroup!: FormGroup;

    assessmentTypes = Object.values(AssessmentType);
    markingSettings = Object.values(MarkingSettings);
    subjects: any = [];
    selectedSubjectName: string = '';

    questionDisplayedColumns: string[] = [
        'drag',
        'no',
        'question',
        'marks',
        'actions',
    ];

    questionReviewColumns: string[] = ['no', 'question', 'marks'];

    questions: QuestionInput[] = [
        {
            no: '1',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
        {
            no: '2',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
        {
            no: '3',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
        {
            no: '4',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
        {
            no: '5',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
    ];
    rubrics!: RubricsInput;

    constructor(
        router: Router,
        authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _subjectService: SubjectService,
        private _assessmentService: AssessmentService,
        private _modalService: NgbModal
    ) {
        super(router, authenticationService);
        this._assessmentService.getApi();
        this._subjectService.getApi().then(() => {
            this._subjectService
                .getAll(this.currentUser.id)
                .then((subjects) => {
                    this.subjects = subjects;
                });
        });

        this.assessmentDetailFormGroup = this._formBuilder.group({
            assessmentName: ['Quiz 1', Validators.required],
            assessmentType: [AssessmentType.ESSAY_BASED, Validators.required],
            subject: [null, Validators.required],
            defaultSetting: [
                MarkingSettings.MARK_BY_SCRIPT,
                Validators.required,
            ],
        });

        this.questionFormGroup = this._formBuilder.group({
            totalMark: ['100', Validators.required],
        });

        this.subjectFormGroup = this._formBuilder.group({
            newSubject: ['', Validators.required],
        });
    }

    emitEvent() {
        // using reference component to trigger the event emit
        this.rubricsInput.rubricsChange.emit(this.rubricsInput.rubrics);
        console.log(this.rubrics);
    }

    onSubmit(): void {
        let questionJson: any = {};
        this.questions.forEach((q) => {
            questionJson[q.no!] = q.value;
        });
        delete this.rubrics.isEdit;
        this.rubrics.criterion!.forEach((c) => {
            delete c.isEdit;
        });

        // TODO: rubrics need to remove isEdit property
        this.assessment = {
            name: this.assessmentDetailFormGroup.get('assessmentName')!.value,
            type: this.assessmentDetailFormGroup.get('assessmentType')!.value,
            subject: this.assessmentDetailFormGroup.get('subject')!.value,
            marking_settings:
                this.assessmentDetailFormGroup.get('defaultSetting')!.value,
            questions: this.questions,
            rubrics: this.rubrics,
            markers: [this.currentUser.id],
        };

        this._assessmentService.create(this.assessment).then(() => {
            this.router.navigate(['/assessment-list']);
        });
    }

    // To mark the invalid fields dirty for triggering error messages
    validateForm(form: FormGroup): void {
        if (form.invalid) {
            Object.values(form.controls).forEach((formControl) => {
                formControl.invalid ? formControl.markAsDirty() : null;
            });
        } else {
            if (form === this.assessmentDetailFormGroup) {
                this.selectedSubjectName = this.subjects.find(
                    (subject: any) => {
                        return subject.id ==
                            this.assessmentDetailFormGroup.value.subject;
                    }
                ).name;
            }
        }
    }

    addQuestion() {
        let ques = new QuestionInput('', { question: '', marks: 0 }, true);
        this.questions = [...this.questions, ques];
    }

    updateQuestion(element: QuestionInput) {
        element.isEdit = !element.isEdit;
    }

    deleteQuestion(element: QuestionInput) {
        this.questions = this.questions.filter((e) => e !== element);
    }

    getTotalMark() {
        return this.questions
            .map((q) => q.value?.marks)
            .reduce((a, b) => a! + b!);
    }

    drop(event: CdkDragDrop<QuestionInput[]>) {
        moveItemInArray(
            this.questions,
            event.previousIndex,
            event.currentIndex
        );
    }

    // REGION FormControls Getters
    get assessmentName() {
        return this.assessmentDetailFormGroup.get('assessmentName');
    }

    get assessmentType() {
        return this.assessmentDetailFormGroup.get('assessmentType');
    }

    get subject() {
        return this.assessmentDetailFormGroup.get('subject');
    }

    get defaultSetting() {
        return this.assessmentDetailFormGroup.get('defaultSetting');
    }

    get newSubject() {
        return this.subjectFormGroup.get('newSubject');
    }
    // END REGION FormControls Getters

    openModal(modal: any) {
        this._modalService.open(modal);
    }

    onSubmitNewSubject(modal: any) {
        let userId: number = this.currentUser.id;
        this._subjectService
            .create({
                name: this.subjectFormGroup.get('newSubject')!.value,
                markers: [userId],
            })
            .then((subject) => {
                console.log(subject);
            });
        this._modalService.dismissAll('Subject Submitted');
        // to reload the page after creating a new subject
        window.location.reload();
    }

    setUneditable(event: any): void {
        this.rubricsInput.rubrics.isEdit = false;
        this.rubricsInput.rubrics.criterion!.forEach((criteria: any) => {
            criteria.isEdit = false;
        });
    }
}
