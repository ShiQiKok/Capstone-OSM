import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent extends AppComponent implements OnInit {
    constructor(router: Router, _authenticationService: AuthenticationService) {
        super(router, _authenticationService);
    }

    ngOnInit(): void {
    }
}
