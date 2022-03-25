import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentDetailsComponent } from './assessment/assessment-details/assessment-details.component';
import { AssessmentListComponent } from './assessment/assessment-list/assessment-list.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';

const routes: Routes = [
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'user-details', component: UserDetailsComponent },
    {path: 'assessment-list', component: AssessmentListComponent},
    {path: 'assessment-details/:id', component: AssessmentDetailsComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
