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
import { NavBarComponent } from './nav/nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ErrorMessageComponent } from './shared-component/error-message/error-message.component';
import { AssessmentCreationFormComponent } from './assessment/assessment-creation/assessment-creation-form/assessment-creation-form.component';
import { MatTreeModule } from '@angular/material/tree';

@NgModule({
    declarations: [
        AppComponent,
        SignupComponent,
        LoginComponent,
        UserDetailsComponent,
        AssessmentDetailsComponent,
        AssessmentListComponent,
        NavBarComponent,
        ErrorMessageComponent,
        AssessmentCreationFormComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatStepperModule,
        MatInputModule,
        MatButtonModule,
        MatTreeModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        UserService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
