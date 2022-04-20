import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import {
    Assessment,
    AssessmentType,
    MarkingSettings,
} from 'src/models/assessment';
import { AuthenticationService } from 'src/services/authentication.service';
import { SubjectService } from 'src/services/subject.service';
import {
    faTrashAlt,
    faEllipsisV,
    faColumns,
} from '@fortawesome/free-solid-svg-icons';
import { AssessmentService } from 'src/services/assessment.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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

class Rubrics {
    marksRange?: RubricMarkRange[] | undefined;
    criterion?: RubricValueInput[] | undefined;
}

class RubricValueInput {
    title?: string | undefined;
    description?: string | undefined;
    totalMarks?: number | undefined;
    columns?: RubricColumnInput[] | undefined;
    isEdit?: boolean | undefined;
}

class RubricColumnInput {
    description?: string | undefined;
}

class RubricMarkRange {
    min?: number | undefined;
    max?: number | undefined;
}

@Component({
    selector: 'app-assessment-creation-form',
    templateUrl: './assessment-creation-form.component.html',
})
export class AssessmentCreationFormComponent
    extends AppComponent
    implements OnInit
{
    // icons
    faTrashAlt = faTrashAlt;
    faEllipsisV = faEllipsisV;

    isLoading: boolean = true;

    assessment?: Assessment;

    assessmentDetailFormGroup!: FormGroup;
    questionFormGroup!: FormGroup;

    assessmentTypes = Object.values(AssessmentType);
    markingSettings = Object.values(MarkingSettings);
    subjects: any = [];

    questionDisplayedColumns: string[] = [
        'drag',
        'no',
        'question',
        'marks',
        'actions',
    ];
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
    rubrics: Rubrics = {
        marksRange: [
            { min: 0, max: 39 },
            { min: 40, max: 49 },
            { min: 50, max: 59 },
            { min: 60, max: 69 },
            { min: 70, max: 100 },
        ],
        criterion: [
            {
                title: 'criteria 1',
                description: 'desc for criteria 1',
                totalMarks: 25,
                isEdit: false,
                columns: [
                    {
                        description: 'desc for col 1 in criteria 1',
                    },
                    {
                        description: 'desc for col 2 in criteria 1',
                    },
                    {
                        description: 'desc for col 3 in criteria 1',
                    },
                    {
                        description: 'desc for col 4 in criteria 1',
                    },
                    {
                        description: "desc for col 5 in criteria 1"
                    }
                ],
            },
            {
                title: 'criteria 2',
                description: 'desc for criteria 2',
                totalMarks: 25,
                isEdit: false,
                columns: [
                    {
                        description: 'desc for col 1 in criteria 2',
                    },
                    {
                        description: 'desc for col 2 in criteria 2',
                    },
                    {
                        description: 'desc for col 3 in criteria 2',
                    },
                    {
                        description: 'desc for col 4 in criteria 2',
                    },
                    {
                        description: "desc for col 5 in criteria 2"
                    }
                ],
            },
            {
                title: 'criteria 3',
                description: 'desc for criteria 3',
                totalMarks: 25,
                isEdit: false,
                columns: [
                    {
                        description: 'desc for col 1 in criteria 3',
                    },
                    {
                        description: 'desc for col 2 in criteria 3',
                    },
                    {
                        description: 'desc for col 3 in criteria 3',
                    },
                    {
                        description: 'desc for col 4 in criteria 3',
                    },
                    {
                        description: "desc for col 5 in criteria 3"
                    }
                ],
            },
            {
                title: 'criteria 4',
                description: 'desc for criteria 4',
                totalMarks: 25,
                isEdit: true,
                columns: [
                    {
                        description: 'desc for col 1 in criteria 4',
                    },
                    {
                        description: 'desc for col 2 in criteria 4',
                    },
                    {
                        description: 'desc for col 3 in criteria 4',
                    },
                    {
                        description: 'desc for col 4 in criteria 4',
                    },
                    {
                        description: "desc for col 5 in criteria 5"
                    }
                ],
            },
        ],
    };

    constructor(
        router: Router,
        authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _subjectService: SubjectService,
        private _assessmentService: AssessmentService
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
    }

    async ngOnInit() {}

    onSubmit(): void {
        let questionJson: any = {};
        this.questions.forEach((q) => {
            questionJson[q.no!] = q.value;
        });
        this.assessment = {
            name: this.assessmentDetailFormGroup.get('assessmentName')!.value,
            type: this.assessmentDetailFormGroup.get('assessmentType')!.value,
            subject: this.assessmentDetailFormGroup.get('subject')!.value,
            marking_settings:
                this.assessmentDetailFormGroup.get('defaultSetting')!.value,
            questions: JSON.stringify(questionJson),
            markers: [this.currentUser.id],
        };

        this._assessmentService.create(this.assessment).then(() => {
            this.router.navigate(['/assessment-list']);
        });
    }

    getRubricsMarksRangeString(): string[] {
        if (this.rubrics && this.rubrics.criterion) {
            return ['criteria'].concat(
                this.rubrics.marksRange!.map((c) => {
                    return `${c.min} - ${c.max}`;
                })
            );
        }
        return [];
    }

    // To mark the invalid fields dirty for triggering error messages
    validateForm(form: FormGroup): void {
        if (form.invalid) {
            Object.values(form.controls).forEach((formControl) => {
                formControl.invalid ? formControl.markAsDirty() : null;
            });
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

    addRubricsRow() {
        let len = this.rubrics.marksRange!.length;
        let row: RubricValueInput = {
            title: 'criteria ' + (this.rubrics.criterion!.length + 1),
            description: '',
            totalMarks: 0,
            isEdit: true,
            columns: [],
        };
        for (let i = 0; i < len; i++) {
            row.columns!.push({
                description: '',
            });
        }
        this.rubrics.criterion = [...this.rubrics.criterion!, row]
        console.log(this.rubrics.criterion);
    }

    addRubricsColumn() {}

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
    // END REGION FormControls Getters
}
