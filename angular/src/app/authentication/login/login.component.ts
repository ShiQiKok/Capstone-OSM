import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    username!: string;
    password!: string;

    isFormValid: boolean = true;
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
        this.isFormValid = true;

        this.authenticationService.login(this.username, this.password).then(
            (data) => {
                let returnUrl = this.route.snapshot.queryParams.returnUrl;
                this.router.navigate([returnUrl || '/user-details']);
            },
            (err) => {
                this.isFormValid = false;
                this.errorMessage = err.error.detail;
                // console.log(err.error.detail)
            }
        );
    }
}
