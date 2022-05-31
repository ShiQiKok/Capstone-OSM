import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { User } from 'src/models/user';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent extends AppComponent implements OnInit {

    isEditing: boolean = false;
    isEditingPassword: boolean = false;
    errorMessage: string = '';
    errorMessageOnSave: string = '';

    passwordForm: FormGroup;
    userInfoForm: FormGroup;

    // icons
    faEyeSlash = faEyeSlash;
    faEye = faEye;

    constructor(
        router: Router,
        private _authenticationService: AuthenticationService,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private modalService: NgbModal,
        private _snackBar: MatSnackBar
    ) {
        super(router, _authenticationService);
        this.userInfoForm = this._formBuilder.group({
            firstName: [this.currentUser.first_name!, Validators.required],
            lastName: [this.currentUser.last_name!, Validators.required],
            email: [
                this.currentUser.email!,
                [
                    Validators.required,
                    Validators.pattern(
                        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
                    ),
                ],
            ],
        });

        this.passwordForm = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
    }

    ngOnInit() {
        this._userService.getApi();
    }

    editUserInfo() {
        this.isEditing = true;
    }

    onSave() {
        if (this.userInfoForm.valid) {
            let tempUser: User = Object.assign({}, this.currentUser);
            // if the form is valid, replace the old value
            tempUser.first_name = this.firstName!.value;
            tempUser.last_name = this.lastName!.value;
            tempUser.email = this.email!.value;

            this._userService
                .update(tempUser.id!, tempUser)
                .then(() => {
                    this._authenticationService.setUser(this.currentUser);
                    this._snackBar.open('Your information is updated!', '', {
                        duration: 3000,
                    });
                }).catch((err) => {
                    this.resetFormWithInitialValue();
                    for (let key in err.error){
                        if (key == 'first_name'){
                            this.errorMessageOnSave = `First Name: ${err.error[key]}`;
                            break;
                        }
                        if (key == 'last_name'){
                            this.errorMessageOnSave = `Last Name: ${err.error[key]}`;
                            break;
                        }
                        if (key == 'email'){
                            this.errorMessageOnSave = `Email: ${err.error[key]}`;
                            break;
                        }
                    }
                });
            this.isEditing = false;
        }
    }

    openModal(modal: any) {
        this.modalService.open(modal);
    }

    onNewPasswordSubmit() {
        if (
            this.newPassword.value ===
            this.confirmPassword.value && this.newPassword.value != ''
        ) {
            this._userService
                .checkPassword(
                    this.currentUser.id!,
                    this.passwordForm.value.currentPassword,
                    this.passwordForm.value.newPassword
                )
                .then((data) => {
                    console.log(data)
                    this.errorMessage= '';
                    this.modalService.dismissAll();
                    this._snackBar.open('Password changed successfully!', '', {
                        duration: 3000,
                    });
                })
                .catch((err) => {
                    for (let key in err.error){
                        if (key == 'password'){
                            this.errorMessage = `Password: ${err.error[key]}`;
                            break;
                        }
                    }
                });
        }else {
            this.errorMessage = "Please make sure your new password and confirm password match!";
        }
        this.clearForm(this.passwordForm);
    }

    cancelEdit(){
        this.isEditing = false;
        this.resetFormWithInitialValue();
    }

    private resetFormWithInitialValue(){
        this.userInfoForm.controls['firstName'].setValue(this.currentUser.first_name);
        this.userInfoForm.controls['lastName'].setValue(this.currentUser.last_name);
        this.userInfoForm.controls['email'].setValue(this.currentUser.email);
    }

    togglePasswordVisibility(id: string, icon: any){
        let element = document.getElementById(id) as HTMLInputElement;
        element.type === 'password' ? element.type = 'text' : element.type = 'password';
        icon.icon.iconName === 'eye-slash' ? icon.icon = faEye : icon.icon = faEyeSlash
        icon.render();
    }

    // GETTERS
    get firstName() {
        return this.userInfoForm.get('firstName')!;
    }
    get lastName() {
        return this.userInfoForm.get('lastName')!;
    }
    get email() {
        return this.userInfoForm.get('email')!;
    }

    get currentPassword() {
        return this.passwordForm.get('currentPassword')!;
    }

    get newPassword() {
        return this.passwordForm.get('newPassword')!;
    }

    get confirmPassword() {
        return this.passwordForm.get('confirmPassword')!;
    }

    private clearForm(form: FormGroup){
        form.reset();
    }
}
