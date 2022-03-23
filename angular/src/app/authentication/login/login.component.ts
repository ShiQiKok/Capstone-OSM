import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { UserService } from 'src/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent extends AppComponent implements OnInit {
    loginForm!: FormGroup;
    username: string = 'admin';
    password: string = '123qwe';

    constructor(private _userService: UserService) {
        super();
    }

    ngOnInit(): void {
        this.onSubmit();
    }

    async onSubmit() {
        await this._userService.login({
            username: this.username,
            password: this.password,
        });
        // TODO: Redirect to another page
        // TODO: Handle Error (invalid inout)
    }
}
