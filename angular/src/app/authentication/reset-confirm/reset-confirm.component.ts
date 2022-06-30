import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
    selector: 'app-reset-confirm',
    templateUrl: './reset-confirm.component.html',
})
export class ResetConfirmComponent implements OnInit {
    uid: string;
    token: string;

    errorMessage: string = '';
    newPassword: string = '';
    confirmPassword: string = '';

    constructor(private router: Router, private route: ActivatedRoute, private _userService: UserService) {
        this.uid = this.route.snapshot.paramMap.get('uid')!;
        this.token = this.route.snapshot.paramMap.get('token')!;
    }

    async ngOnInit() {
        await this._userService.getApi();
    }

    onSubmit(){
        if (this.newPassword === this.confirmPassword && this.newPassword != '') {
            this._userService.resetPassword(this.uid, this.token, this.newPassword).then(() => {
                this.onSuccessCallback()
            }).catch((err) => {
                this.errorMessage = err.error['password']
            });
        }
    }

    onSuccessCallback(){
        // update HTML content
        let body = document.querySelector('div#content-body')!;
        body.innerHTML = `
        <div class="card my-4">
            <div class="card-body">
                <h5 class="card-title">Your password is reset successfully!</h5>
                <p class="card-text">You'll be redirected to the login page in a while!</p>
            </div>
        </div>`;

        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 3000);
    }
}
