import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
})
export class NavBarComponent extends AppComponent implements OnInit {
    public isUserLoggedIn: boolean;

    constructor(router: Router, authenticationService: AuthenticationService) {
        super(router, authenticationService);
        this.isUserLoggedIn = this.currentUser ? true : false;
    }

    ngOnInit(): void {}

    logout() {
        this.authenticationService.logout().then(() => {
            this.isUserLoggedIn = false;
            this.router.navigate(['/login']);
        });
    }
}
