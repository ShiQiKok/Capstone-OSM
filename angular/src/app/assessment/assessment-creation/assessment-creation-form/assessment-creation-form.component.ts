import { Component, ElementRef, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-assessment-creation-form',
    templateUrl: './assessment-creation-form.component.html',
    styleUrls: ['./assessment-creation-form.component.scss'],
})
export class AssessmentCreationFormComponent implements OnInit {
    assessmentDetailFormGroup: FormGroup;
    questionFormGroup: FormGroup;
    hasMarkAllocationFormBuilt: boolean = false;

    questionControlList: AbstractControl[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private elementRef: ElementRef
    ) {
        this.assessmentDetailFormGroup = this._formBuilder.group({
            assessmentName: ['Quiz 1', Validators.required],
            assessmentType: ['QUESTION BASED', Validators.required],
            subject: ['CI', Validators.required],
            noOfQuestions: ['3', Validators.required],
        });

        this.questionFormGroup = this._formBuilder.group({
            totalMark: ['100', Validators.required],
        });
    }

    ngOnInit(): void {}

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
                    `Question${i + 1}`,
                    this._formBuilder.control('')
                );

                if (element) {
                    element.appendChild(this.getQuestionTemplate(i ));
                    let button = document.createElement('button');
                    button.onclick = this.addSubQuestion.bind(this, i );
                    button.innerHTML = '+ Add sub-question';
                    button.setAttribute('class', 'btn btn-link');
                    button.setAttribute('id', `addSubQuesButton${i }`);
                    element.appendChild(button);
                }
            }
            this.hasMarkAllocationFormBuilt = true;
        }
        // TODO: update form control when the no. of ques. has changed
    }

    private getQuestionTemplate(n: number): any {
        let group = document.createElement('div');
        group.setAttribute('class', 'form-group');
        group.setAttribute('id', `questionGroup${n}`);

        let h5 = document.createElement('h5');
        h5.innerHTML = `Question ${n}`;

        let textarea = document.createElement('textarea');
        textarea.setAttribute('class', 'form-control');
        textarea.setAttribute('placeholder', `Enter question ${n}`);

        group.appendChild(h5);
        group.appendChild(textarea);

        return group;
    }

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
