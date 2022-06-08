import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'src/models/subject';
import { AuthenticationService } from 'src/services/authentication.service';
import { SubjectService } from 'src/services/subject.service';
import { AppComponent } from '../app.component';

@Component({
    selector: 'app-subject',
    templateUrl: './subject.component.html',
})
export class SubjectComponent extends AppComponent implements OnInit {
    // objects
    subjects!: Subject[];

    // controls
    isLoading: boolean = true;

    constructor(
        private _subjectService: SubjectService,
        private _snackBar: MatSnackBar,
        router: Router,
        _authenticationService: AuthenticationService
    ) {
        super(router, _authenticationService);
    }

    async ngOnInit() {
        this.isLoading = true;
        await this._subjectService.getApi();
        await this.getSubjects();
        this.isLoading = false;
    }

    getSubjectService(): SubjectService {
        return this._subjectService;
    }

    getUserId(): number {
        return this.currentUser.id!;
    }

    onEditClicked(subject: Subject) {
        subject.isEditing = !subject.isEditing;

        if (!subject.isEditing) {
            this.saveSubject(subject);
        }
    }

    onDeleteClicked(subject: Subject) {
        this._subjectService.delete(subject.id).then(() => {
            this.subjects = this.subjects.filter((s) => s.id !== subject.id);
            this._snackBar.open(
                `The subject ${subject.name} is successfully deleted!`,
                'Dismiss',
                {
                    duration: 3000,
                }
            );
        });
    }

    private async getSubjects() {
        this.subjects = (await this._subjectService.getAll(
            this.currentUser.id!
        )) as Subject[];
    }

    private saveSubject(subject: Subject) {
        delete subject.isEditing;

        this._subjectService.update(subject.id!, subject).then((obj: any) => {
            this._snackBar.open(
                `The subject ${obj.name} is successfully updated!`,
                'Dismiss',
                {
                    duration: 3000,
                }
            );
        });
    }
}
