import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import {
    Assessment,
    AssessmentType,
    MarkingSettings,
} from 'src/models/assessment';
import { AuthenticationService } from 'src/services/authentication.service';
import { SubjectService } from 'src/services/subject.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AssessmentService } from 'src/services/assessment.service';

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

    isLoading: boolean = true;

    assessment?: Assessment;

    assessmentDetailFormGroup!: FormGroup;
    questionFormGroup!: FormGroup;

    assessmentTypes = Object.values(AssessmentType);
    markingSettings = Object.values(MarkingSettings);
    subjects: any = [];

    displayedColumns: string[] = ['no', 'question', 'marks', 'actions'];
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
            markers: [this.currentUser.id]
        };

        this._assessmentService.create(this.assessment).then(() => {
            this.router.navigate(['/assessment-list']);
        })
        // console.log(this.assessmentDetailFormGroup.controls);

        // Object.keys(this.questionFormGroup.controls).forEach((key) => {
        //     let field = this.questionFormGroup.get(key)!.value;
        //     console.log(key, field);
        // });
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
