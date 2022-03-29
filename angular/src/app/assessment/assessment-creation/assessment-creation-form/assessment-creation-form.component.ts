import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
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

@Component({
    selector: 'app-assessment-creation-form',
    templateUrl: './assessment-creation-form.component.html',
    styleUrls: ['./assessment-creation-form.component.scss'],
})
export class AssessmentCreationFormComponent
    extends AppComponent
    implements OnInit
{
    assessment?: Assessment;

    assessmentDetailFormGroup!: FormGroup;
    questionFormGroup!: FormGroup;
    hasMarkAllocationFormBuilt: boolean = false;

    assessmentTypes = Object.values(AssessmentType);
    markingSettings = Object.values(MarkingSettings);
    subjects: any = [];

    questionControlList: AbstractControl[] = [];

    constructor(
        router: Router,
        authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _subjectService: SubjectService
    ) {
        super(router, authenticationService);
        this._subjectService.getApi().then(() => {
            this._subjectService
                .getAll(this.currentUser.id)
                .then((subjects) => {
                    this.subjects = subjects;
                });
        });
    }

    async ngOnInit() {
        console.log(this.subjects[1]);
        this.assessmentDetailFormGroup = this._formBuilder.group({
            assessmentName: ['Quiz 1', Validators.required],
            assessmentType: [AssessmentType.ESSAY_BASED, Validators.required],
            subject: [this.subjects[1], Validators.required],
            defaultSetting: [
                MarkingSettings.MARK_BY_SCRIPT,
                Validators.required,
            ],
            noOfQuestions: ['3', Validators.required],
        });
        this.questionFormGroup = this._formBuilder.group({
            totalMark: ['100', Validators.required],
        });
    }

    onSubmit(): void {
        // create assessment object with the info in two FormGroups
        // this.assessment ={
        //     name: this.assessmentDetailFormGroup.get('assessmentName')!.value as string,
        //     type: this.assessmentDetailFormGroup.get('assessmentType')!.value as AssessmentType,
        //     subject: this.assessmentDetailFormGroup.get('subject')!.value.id as number,
        //     marking_settings: this.assessmentDetailFormGroup.get('defaultSetting')!.value as MarkingSettings,
        //     questions: JSON.parse(this.questionControlList.toLocaleString()) as string[],
        // };

        console.log(this.questionFormGroup.controls);

        // this.assessment = assessment as Assessment;
        // this.assessment = {
        // }
    }

    get assessmentName() {
        return this.assessmentDetailFormGroup.get('assessmentName');
    }

    get assessmentType() {
        return this.assessmentDetailFormGroup.get('assessmentType');
    }

    // create get method for all the form controls
    get subject() {
        return this.assessmentDetailFormGroup.get('subject');
    }

    get defaultSetting() {
        return this.assessmentDetailFormGroup.get('defaultSetting');
    }

    get noOfQuestions() {
        return this.assessmentDetailFormGroup.get('noOfQuestions');
    }

    validateForm(form: FormGroup): void {
        if (!form.valid) {
            Object.keys(form.controls).forEach((key) => {
                let field = form.get(key);
                field?.invalid ? field.markAsDirty() : null;
            });
        }
        form == this.assessmentDetailFormGroup
            ? this.buildMarkAllocationForm()
            : null;
    }

    private buildMarkAllocationForm(): void {
        if (!this.hasMarkAllocationFormBuilt) {
            let noOfQues: number =
                this.assessmentDetailFormGroup.get('noOfQuestions')?.value;

            let element = document.getElementById('questionForm');

            for (let i = 1; i <= noOfQues; i++) {
                this.questionFormGroup.addControl(
                    `Question${i}`,
                    this._formBuilder.control(`testing ${i}`)
                );

                if (element) {
                    element.appendChild(this.getQuestionTemplate(i));
                    let button = document.createElement('button');
                    button.onclick = this.addSubQuestion.bind(this, i);
                    button.innerHTML = '+ Add sub-question';
                    button.setAttribute('class', 'btn btn-link');
                    button.setAttribute('id', `addSubQuesButton${i}`);
                    element.appendChild(button);
                }
            }
            this.hasMarkAllocationFormBuilt = true;
        }
        // TODO: update form control when the no. of ques. has changed
    }

    // TODO: add error message
    private getQuestionTemplate(n: number): any {
        let group = document.createElement('div');
        group.setAttribute('class', 'form-group');
        group.setAttribute('id', `questionGroup${n}`);

        let h5 = document.createElement('h5');
        h5.innerHTML = `Question ${n}`;

        let textarea = document.createElement('textarea');
        textarea.setAttribute('class', 'form-control');
        textarea.setAttribute('placeholder', `Enter question ${n}`);
        textarea.setAttribute('formControlName', `Question${n}`);

        group.appendChild(h5);
        group.appendChild(textarea);

        return group;
    }

    // TODO: add form control and modify the main question name and control
    private addSubQuestion(n: number): void {
        let container = document.getElementById(`questionGroup${n}`);

        let title = document.createElement('h5');
        title.innerHTML = `Question ${n}`;

        let textarea = document.createElement('textarea');
        textarea.setAttribute('class', 'form-control');
        textarea.setAttribute('placeholder', `Enter question ${n}`);

        container?.appendChild(title);
        container?.appendChild(textarea);
    }
}
