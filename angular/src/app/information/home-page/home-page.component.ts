import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent extends AppComponent {
    constructor(router: Router, authenticationService: AuthenticationService) {
        super(router, authenticationService);
        this.router.navigate(['/login']);
    }
}
