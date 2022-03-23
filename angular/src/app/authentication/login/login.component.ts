import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    username!: string;
    password!: string;

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) {
    }

    ngOnInit(): void {}

    onSubmit() {
        this.authenticationService
            .login(this.username, this.password)
            .then((data) => {
                this.router.navigate(['user-details']);
            },
            (err) => {
                alert(err);
            })
        // TODO: Redirect to another page
        // TODO: Handle Error (invalid inout)
    }
}
