import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/helper/auth.gurd';
import { PendingChangesGuard } from 'src/helper/pending-changes.guard';
import { AssessmentCreationFormComponent } from './assessment/assessment-creation/assessment-creation-form.component';
import { AssessmentDetailsComponent } from './assessment/assessment-details/assessment-details.component';
import { AssessmentListComponent } from './assessment/assessment-list/assessment-list.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { CreationRubricsQuestionsComponent } from './information/creation-rubrics-questions/creation-rubrics-questions.component';
import { HomePageComponent } from './information/home-page/home-page.component';
import { MarkingComponent } from './marking/marking.component';
import { SubjectComponent } from './subject/subject.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';

const routes: Routes = [
    {path: '', component: HomePageComponent},
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'creation-rubrics-questions',
        component: CreationRubricsQuestionsComponent,
    },
    {
        path: 'user-details',
        component: UserDetailsComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'assessment-list',
        component: AssessmentListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'assessment-details/:id',
        component: AssessmentDetailsComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'assessment-create',
        component: AssessmentCreationFormComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'marking/:id',
        component: MarkingComponent,
        canActivate: [AuthGuard],
        canDeactivate: [PendingChangesGuard],
    },
    {
        path: 'subjects',
        component: SubjectComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard],
})
export class AppRoutingModule {}
