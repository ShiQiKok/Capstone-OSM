import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { faTimesCircle, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { AssessmentService } from 'src/services/assessment.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RubricsInputComponent } from 'src/app/shared-component/rubrics-input/rubrics-input.component';
import { QuestionInputComponent } from 'src/app/shared-component/question-input/question-input.component';
import { UserService } from 'src/services/user.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';

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

class UserCollabInfo {
    id!: number;
    username!: string;
    email!: string;
}

@Component({
    selector: 'app-assessment-creation-form',
    templateUrl: './assessment-creation-form.component.html',
})
export class AssessmentCreationFormComponent extends AppComponent {
    // Component Reference
    @ViewChild('rubricsInput') rubricsInput!: RubricsInputComponent;
    @ViewChild('questionsInput') questionsInput!: QuestionInputComponent;
    @ViewChild('collaborators') collaborators!: ElementRef;
    @ViewChild('questionToggle') questionToggle!: MatSlideToggle;

    // icons
    faTrashAlt = faTrashAlt;
    isLoading: boolean = true;
    assessment?: Assessment;

    assessmentDetailFormGroup!: FormGroup;
    subjectFormGroup!: FormGroup;

    assessmentTypes = Object.values(AssessmentType);
    markingSettings = Object.values(MarkingSettings);
    subjects: any = [];
    selectedSubjectName: string = '';
    collabUsers: UserCollabInfo[] = [];
    selectedCollabUser: UserCollabInfo[] = [];

    questions!: QuestionInput[] | undefined;
    rubrics!: RubricsInput;

    faTimesCircle = faTimesCircle;

    constructor(
        router: Router,
        authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _subjectService: SubjectService,
        private _assessmentService: AssessmentService,
        private _userService: UserService,
        private _modalService: NgbModal
    ) {
        super(router, authenticationService);
        this._assessmentService.getApi();

        this._subjectService.getApi().then(() => {
            this._subjectService
                .getAll(this.currentUser.id!)
                .then((subjects) => {
                    this.subjects = subjects;
                });
        });

        this._userService.getApi().then(() => {
            this._userService.getCollabUser().then((users) => {
                this.collabUsers = users;
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

        this.subjectFormGroup = this._formBuilder.group({
            newSubject: ['', Validators.required],
        });
    }

    ngAfterViewInit() {
        console.log(this.questionToggle);
    }

    emitQuestionInputEvent() {
        if (this.questionToggle.checked) {
            // using reference component to trigger the event emit
            this.questionsInput.questionsChange.emit(
                this.questionsInput.questions
            );
        } else {
            this.questions = undefined;
        }
        console.log(this.questions);

    }

    emitRubricsInputEvent() {
        // using reference component to trigger the event emit
        this.rubricsInput.rubricsChange.emit(this.rubricsInput.rubrics);
        console.log(this.rubrics);
    }

    onSubmit(): void {
        delete this.rubrics.isEdit;
        this.rubrics.criterion!.forEach((c) => {
            delete c.isEdit;
        });

        let collaborators = this.selectedCollabUser.map((u) => {
            return u.id;
        });

        if (!collaborators.includes(this.currentUser.id!)) {
            collaborators.push(this.currentUser.id!);
        }

        this.assessment = {
            name: this.assessmentDetailFormGroup.get('assessmentName')!.value,
            type: this.assessmentDetailFormGroup.get('assessmentType')!.value,
            subject: this.assessmentDetailFormGroup.get('subject')!.value,
            marking_settings:
                this.assessmentDetailFormGroup.get('defaultSetting')!.value,
            questions: this.questions ? this.questions : null,
            rubrics: this.rubrics,
            markers: collaborators,
        };

        console.log(this.assessment);

        // this._assessmentService.create(this.assessment).then(() => {
        //     this.router.navigate(['/assessment-list']);
        // });
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
                        return (
                            subject.id ==
                            this.assessmentDetailFormGroup.value.subject
                        );
                    }
                ).name;
            }
        }
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
        let userId: number = this.currentUser.id!;
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

    onEnterPressed(event: Event) {
        let inputValue = this.collaborators.nativeElement.value;
        let msgElement = document.querySelector('#collaborationMsg')!;
        let user = this.collabUsers.find((user) => {
            if (user.email == inputValue || user.username == inputValue) {
                return true;
            }
            return false;
        });

        if (user && !this.selectedCollabUser.includes(user)) {
            this.selectedCollabUser.push(user);
            msgElement.innerHTML = '';
        } else if (!user) {
            msgElement.innerHTML =
                'User not found! Please make sure you have entered the correct email or username.';
        }

        this.collaborators.nativeElement.value = '';
    }

    removeCollaborator(user: UserCollabInfo) {
        let index = this.selectedCollabUser.indexOf(user);

        if (index >= 0) {
            this.selectedCollabUser.splice(index, 1);
        }
    }
}
