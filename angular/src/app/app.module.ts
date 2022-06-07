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
import { AssessmentCreationFormComponent } from './assessment/assessment-creation/assessment-creation-form.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from './shared-component/spinner/spinner.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MarkingComponent } from './marking/marking.component';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HighlightTextComponent } from './marking/highlight-text/highlight-text.component';
import { RubricsInputComponent } from './shared-component/rubrics-input/rubrics-input.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { QuestionInputComponent } from './shared-component/question-input/question-input.component';
import { PendingChangesGuard } from 'src/helper/pending-changes.guard';
import { CreationRubricsQuestionsComponent } from './information/creation-rubrics-questions/creation-rubrics-questions.component';
import { SubjectComponent } from './subject/subject.component';
import { SubjectCreationModalComponent } from './subject/subject-creation-modal/subject-creation-modal.component';
import { HomePageComponent } from './information/home-page/home-page.component';

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
        SpinnerComponent,
        MarkingComponent,
        HighlightTextComponent,
        RubricsInputComponent,
        QuestionInputComponent,
        CreationRubricsQuestionsComponent,
        SubjectComponent,
        SubjectCreationModalComponent,
        HomePageComponent,
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
        MatTableModule,
        MatListModule,
        MatProgressSpinnerModule,
        FontAwesomeModule,
        DragDropModule,
        MatSnackBarModule,
        MatChipsModule,
        MatSlideToggleModule,
        MatSortModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        UserService,
        PendingChangesGuard,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
