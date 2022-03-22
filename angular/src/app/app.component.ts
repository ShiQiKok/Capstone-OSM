import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { throwError } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'OSM';

    constructor() {}

    ngOnInit() {}
}
