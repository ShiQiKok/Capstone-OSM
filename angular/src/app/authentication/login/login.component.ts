import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    username: string = '';
    password: string = '';

    isFormValid: boolean = true;
    isUsernameValid: boolean = true;
    isPasswordValid: boolean = true;
    errorMessage: string = '';

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        if (this.authenticationService.currentUserValue()) {
            this.router.navigate(['user-details/']);
        }
    }

    onSubmit() {
        let checkbox = document.getElementById(
            'rememberMeCheck'
        ) as HTMLInputElement;

        this.isUsernameValid = true;
        this.isPasswordValid = true;

        if (this.username === '') {
            this.isUsernameValid = false;
        } else if (this.password === '') {
            this.isPasswordValid = false;
        } else {
            this.authenticationService
                .login(this.username, this.password, checkbox.checked)
                .then(() => {
                    let returnUrl = this.route.snapshot.queryParams.returnUrl;
                    this.router.navigate([returnUrl || '/assessment-list']);
                })
                .catch((err) => {
                    this.isFormValid = false;
                    this.errorMessage =
                        'Your username or password is incorrect.';
                    this.username = '';
                    this.password = '';
                });
        }
    }
}
