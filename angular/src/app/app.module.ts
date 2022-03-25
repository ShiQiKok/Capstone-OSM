import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserService } from '../services/user.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './authentication/signup/signup.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './authentication/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { JwtInterceptor } from 'src/helper/jwt.interceptor';
import { AssessmentDetailsComponent } from './assessment/assessment-details/assessment-details.component';
import { AssessmentListComponent } from './assessment/assessment-list/assessment-list.component';
import { AuthenticationService } from 'src/services/authentication.service';
import { AssessmentService } from 'src/services/assessment.service';

@NgModule({
    declarations: [
        AppComponent,
        SignupComponent,
        LoginComponent,
        UserDetailsComponent,
        AssessmentDetailsComponent,
        AssessmentListComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        AuthenticationService,
        UserService,
        AssessmentService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
