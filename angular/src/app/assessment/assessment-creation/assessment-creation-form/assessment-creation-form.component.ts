import { Component, OnInit } from '@angular/core';
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
    markAllocationFormGroup: FormGroup;
    hasMarkAllocationFormBuilt: boolean = false;

    questionControlList: AbstractControl[] = [];

    constructor(private _formBuilder: FormBuilder) {
        this.assessmentDetailFormGroup = this._formBuilder.group({
            assessmentName: ['Quiz 1', Validators.required],
            assessmentType: ['QUESTION BASED', Validators.required],
            subject: ['CI', Validators.required],
            noOfQuestions: ['5', Validators.required],
        });

        this.markAllocationFormGroup = this._formBuilder.group({
            totalMark: ['', Validators.required],
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

            let element = document.getElementById('markAllocationForm');

            for (let i = 0; i < noOfQues; i++) {
                this.markAllocationFormGroup.addControl(
                    `Question${i + 1}`,
                    this._formBuilder.control('', Validators.required)
                );

                if (element) {
                    element.innerHTML += ` <div class="form-group d-flex align-items-center">
                  <label for="Question${i + 1}">Q.${i + 1}</label>
                  <input
                      type="number"
                      placeholder="Enter Mark"
                      class="form-control ml-5"
                      formControlName="Question${i + 1}"
                      id="Question${i + 1}"
                      name="Question${i + 1}"
                  />
              </div>`;
                }
            }
            this.hasMarkAllocationFormBuilt = true;
        }
    }
}
