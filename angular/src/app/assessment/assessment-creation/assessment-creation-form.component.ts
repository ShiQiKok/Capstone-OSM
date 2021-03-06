import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import {
    Assessment,
    AssessmentType,
    GradingMethod,
    Question,
    Rubrics,
} from 'src/models/assessment';
import { AuthenticationService } from 'src/services/authentication.service';
import { SubjectService } from 'src/services/subject.service';
import { faTimesCircle, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { AssessmentService } from 'src/services/assessment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RubricsInputComponent } from 'src/app/shared-component/rubrics-input/rubrics-input.component';
import { QuestionInputComponent } from 'src/app/shared-component/question-input/question-input.component';
import { UserService } from 'src/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserCollabInfo } from 'src/models/user';

@Component({
    selector: 'app-assessment-creation-form',
    templateUrl: './assessment-creation-form.component.html',
})
export class AssessmentCreationFormComponent extends AppComponent {
    // Component References
    @ViewChild('rubricsInput') rubricsInput!: RubricsInputComponent;
    @ViewChild('questionsInput') questionsInput!: QuestionInputComponent;
    @ViewChild('collaborators') collaborators!: ElementRef;

    // icons
    faTrashAlt = faTrashAlt;
    faTimesCircle = faTimesCircle;

    // controls
    isLoading: boolean = true;
    isGradingRubrics: boolean = true;

    // form groups
    assessmentDetailFormGroup!: FormGroup;

    // objects
    assessment?: Assessment;
    questions!: Question[] | undefined;
    rubrics!: Rubrics | undefined;
    assessmentTypes = Object.values(AssessmentType);
    gradingMethods = Object.values(GradingMethod);
    subjects: any = [];
    collabUsers: UserCollabInfo[] = [];
    selectedCollabUser: UserCollabInfo[] = [];
    selectedSubjectName: string = '';
    submitErrorMessage = '';

    constructor(
        router: Router,
        authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _subjectService: SubjectService,
        private _assessmentService: AssessmentService,
        private _userService: UserService,
        private _modalService: NgbModal,
        private _snackBar: MatSnackBar
    ) {
        super(router, authenticationService);

        this.assessmentDetailFormGroup = this._formBuilder.group({
            assessmentName: ['Quiz 1', Validators.required],
            assessmentType: [AssessmentType.ESSAY_BASED, Validators.required],
            gradingMethod: [GradingMethod.RUBRICS, Validators.required],
            subject: [null, Validators.required],
        });
    }

    ngOnInit() {
        this.isLoading = true;
        this._assessmentService.getApi();
        this._subjectService.getApi().then(() => {
            this._subjectService
                .getAll(this.currentUser.id!)
                .then((subjects) => {
                    this.subjects = subjects;
                    this.isLoading = false;
                });
        });

        this._userService.getApi().then(() => {
            this._userService.getCollabUser().then((users) => {
                this.collabUsers = users;
            });
        });
    }

    emitGradingMethod() {
        if (this.isGradingRubrics) {
            this.emitRubricsInputEvent();
            this.questions = undefined;
        } else {
            this.emitQuestionInputEvent();
            this.rubrics = undefined;
        }
    }

    emitQuestionInputEvent() {
        this.questionsInput.setAllUneditable();
        this.questionsInput.questionsChange.emit(this.questionsInput.questions);
    }

    emitRubricsInputEvent() {
        this.rubricsInput.setUneditable();
        // using reference component to trigger the event emit
        this.rubricsInput.rubricsChange.emit(this.rubricsInput.rubrics);
    }

    onSubmit(): void {
        this.submitErrorMessage = '';

        // check if either question or rubrics is enabled
        // if (!this.rubricsToggle.checked && !this.questionToggle.checked) {
        //     this.submitErrorMessage =
        //         'You must enable either questions or rubrics marking!';
        //     return;
        // }

        // delete edit controls from rubrics object
        if (this.rubrics) {
            delete this.rubrics.isEdit;
            this.rubrics.criterion!.forEach((c: any) => {
                delete c.isEdit;
            });
        }

        // delete edit controls from question object
        if (this.questions) {
            this.questions.forEach((q) => {
                delete q.isEdit;
            });
        }

        // create array storing the ids of the selected collab users
        let collaborators = this.selectedCollabUser.map((u) => {
            return u.id;
        });

        // add the creator to the collab list
        if (!collaborators.includes(this.currentUser.id!)) {
            collaborators.push(this.currentUser.id!);
        }

        // assign values into assessment object
        this.assessment = {
            name: this.assessmentDetailFormGroup.get('assessmentName')!.value,
            type: this.assessmentDetailFormGroup.get('assessmentType')!.value,
            subject: this.assessmentDetailFormGroup.get('subject')!.value,
            grading_method:
                this.assessmentDetailFormGroup.get('gradingMethod')!.value,
            questions: this.questions ? this.questions : undefined,
            rubrics: this.rubrics ? this.rubrics : undefined,
            markers: collaborators,
        };

        this._assessmentService
            .create(this.assessment)
            .then(() => {
                this._snackBar.open(
                    `The assessment ${
                        this.assessment!.name
                    } is successfully created!`,
                    'Dismiss',
                    {
                        duration: 3000,
                    }
                );
                this.router.navigate(['/assessment-list']);
            })
            .catch((error) => {
                let errorField = Object.keys(error.error)[0];
                this.submitErrorMessage = `${errorField}: ${error.error[errorField]}`;
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
                        return (
                            subject.id ==
                            this.assessmentDetailFormGroup.value.subject
                        );
                    }
                ).name;
                this.isGradingRubrics =
                    this.gradingMethod!.value == GradingMethod.RUBRICS;
            }
        }
    }

    getSubjectService(): SubjectService {
        return this._subjectService;
    }

    getUserId(): number {
        return this.currentUser.id!;
    }

    // REGION FormControls Getters
    get assessmentName() {
        return this.assessmentDetailFormGroup.get('assessmentName');
    }

    get assessmentType() {
        return this.assessmentDetailFormGroup.get('assessmentType');
    }

    get gradingMethod() {
        return this.assessmentDetailFormGroup.get('gradingMethod');
    }

    get subject() {
        return this.assessmentDetailFormGroup.get('subject');
    }
    // END REGION FormControls Getters

    openModal(modal: any) {
        this._modalService.open(modal);
    }

    setUneditable(event: any): void {
        this.rubricsInput.rubrics.isEdit = false;
        this.rubricsInput.rubrics.criterion!.forEach((criteria: any) => {
            criteria.isEdit = false;
        });
    }

    onEnterPressed() {
        let inputValue = this.collaborators.nativeElement.value;
        let msgElement = document.querySelector('#collaborationMsg')!;
        let user = this.collabUsers.find((user) => {
            if (user.email == inputValue || user.username == inputValue) {
                return true;
            }
            return false;
        });

        if (user) {
            if (
                user.username == this.currentUser.username ||
                user.email == this.currentUser.email
            ) {
                msgElement.innerHTML = 'You are one of the markers already.';
            } else if (this.selectedCollabUser.includes(user)) {
                msgElement.innerHTML = 'This user is added already.';
            } else if (!this.selectedCollabUser.includes(user)) {
                this.selectedCollabUser.push(user);
                msgElement.innerHTML = '';
            }
        } else {
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
