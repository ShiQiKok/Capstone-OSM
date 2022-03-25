import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    app_title = 'OSM';
    currentUser!: User;

    router!: Router;
    authenticationService!: AuthenticationService;

    constructor(router: Router, authenticationService: AuthenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
        this.authenticationService.currentUser.subscribe(
            (x) => (this.currentUser = x)
        );
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
