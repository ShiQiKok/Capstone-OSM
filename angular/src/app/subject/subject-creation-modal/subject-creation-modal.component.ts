import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubjectService } from 'src/services/subject.service';

@Component({
    selector: 'app-subject-creation-modal',
    templateUrl: './subject-creation-modal.component.html',
})
export class SubjectCreationModalComponent implements OnInit {
    @Input() subjectService!: SubjectService;
    @Input() userId!: number;
    @ViewChild('subjectCreationModal') subjectCreationModal: any;

    subjectFormGroup!: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _modalService: NgbModal,
        private _snackBar: MatSnackBar
    ) {
        this.subjectFormGroup = this._formBuilder.group({
            newSubject: ['', Validators.required],
        });
    }

    openModal(): void {
        this._modalService.open(this.subjectCreationModal);
    }

    ngOnInit(): void {}

    get newSubject() {
        return this.subjectFormGroup.get('newSubject');
    }

    onSubmitNewSubject() {
        this.subjectService
            .create({
                name: this.newSubject!.value,
                markers: [this.userId],
            })
            .then((subject: any) => {
                this._snackBar.open(
                    `Subject ${subject.name} is created!`,
                    `Dismiss`,
                    {
                        duration: 3000,
                    }
                );
            });
        this._modalService.dismissAll();
        window.location.reload();
    }
}
