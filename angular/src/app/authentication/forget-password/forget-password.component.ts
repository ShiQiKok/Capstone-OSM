import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
})
export class ForgetPasswordComponent implements OnInit {
    errorMessage: string = '';
    recoveryEmail: string = '';

    isLoading = false;

    EMAIL_REGEX = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    constructor(private _userService: UserService) {}

    async ngOnInit() {
        await this._userService.getApi();
    }

    onSubmit() {
        this.errorMessage = '';
        if (this.recoveryEmail.match(this.EMAIL_REGEX)) {
            this.isLoading = true;
            this._userService.checkEmail(this.recoveryEmail).then((msg) => {
                this.isLoading = false;
                this.onSuccessCallback();
            });
        } else {
            this.errorMessage = 'Invalid email address';
            this.recoveryEmail = '';
        }
    }

    onSuccessCallback() {
        // update HTML content
        let body = document.querySelector('div#content-body')!;
        body.innerHTML = `
        <div class="container">
            <div class="card my-4">
                <div class="card-body">
                    <h5 class="card-title">Please check your email</h5>
                    <p class="card-text">A link was sent to your email. You are able to reset your password via the link.</p>
                </div>
            </div>
        </div>`;
    }
}
