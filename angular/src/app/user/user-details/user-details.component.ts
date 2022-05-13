import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

class UserEditInput {
    username!: string;
    first_name!: string;
    last_name!: string;
    email!: string;
}

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent extends AppComponent implements OnInit {
    isEditing: boolean = false;
    isEditingPassword: boolean = false;
    showErrorMessage: boolean = false;
    errorMessage: string = '';

    passwordForm: FormGroup;

    dummyUser: UserEditInput;

    constructor(
        router: Router,
        private _authenticationService: AuthenticationService,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private modalService: NgbModal,
        private _snackBar: MatSnackBar
    ) {
        super(router, _authenticationService);
        this.dummyUser = {
            username: this.currentUser.username,
            first_name: this.currentUser.first_name,
            last_name: this.currentUser.last_name,
            email: this.currentUser.email,
        };

        this.passwordForm = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        })
    }

    ngOnInit(){
        this._userService.getApi();
    }

    editUserInfo() {
        this.isEditing = true;
    }

    onSave() {
        this.currentUser.username = this.dummyUser.username;
        this.currentUser.first_name = this.dummyUser.first_name;
        this.currentUser.last_name = this.dummyUser.last_name;
        this.currentUser.email = this.dummyUser.email;
        this._userService.update(this.currentUser.id, this.currentUser).then(user => {
            this._authenticationService.setUser(this.currentUser);
        })
        this.isEditing = false;
    }

    openModal(modal: any){
        this.modalService.open(modal);
    }

    onNewPasswordSubmit(){
        if(this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword){
            this._userService.checkPassword(this.currentUser.id, this.passwordForm.value.currentPassword, this.passwordForm.value.newPassword).then(data => {
                this.modalService.dismissAll();
                this._snackBar.open('Password changed successfully!', '', {
                    duration: 3000
                });
            }).catch(err => {
                this.showErrorMessage = true;
                this.errorMessage = err.error.details;
            })
        };
    }

}
