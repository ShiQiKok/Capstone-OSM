import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
})
export class SignupComponent extends AppComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void {}
}
