import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
    signupFormGroup: FormGroup;

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _userService: UserService
    ) {
        this.signupFormGroup = this._formBuilder.group({
            username: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
    }

    async ngOnInit() {
        await this._userService.getApi();
    }

    onSubmit() {
        console.log('1');
        // check if form valid
        if (this.signupFormGroup.valid) {
            console.log('2');
            // check if passwords match
            if (this.password!.value === this.confirmPassword!.value) {
                let user: User = {
                    username: this.username!.value,
                    first_name: this.firstName!.value,
                    last_name: this.lastName!.value,
                    email: this.email!.value,
                    password: this.password!.value,
                };

                this._userService
                    .create(user)
                    .then((user) => {
                        console.log(user);
                        this.onSuccessCallback();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        } else {
            Object.values(this.signupFormGroup.controls).forEach(
                (formControl) => {
                    formControl.invalid ? formControl.markAsDirty() : null;
                }
            );
        }
    }

    get username() {
        return this.signupFormGroup.get('username');
    }
    get firstName() {
        return this.signupFormGroup.get('firstName');
    }
    get lastName() {
        return this.signupFormGroup.get('lastName');
    }
    get email() {
        return this.signupFormGroup.get('email');
    }
    get password() {
        return this.signupFormGroup.get('password');
    }
    get confirmPassword() {
        return this.signupFormGroup.get('confirmPassword');
    }

    onSuccessCallback(){
        // update HTML content
        let body = document.querySelector('div#content-body')!;
        body.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Successful!</h5>
                <p class="card-text">Your account is successfully created. You'll be redirected to the login page in a while!</p>
            </div>
        </div>`;

        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 3000);
    }
}
