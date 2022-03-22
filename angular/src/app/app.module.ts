import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserService } from '../services/user.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './signup/signup.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [AppComponent, SignupComponent],
    imports: [BrowserModule, HttpClientModule, NgbModule, AppRoutingModule],
    providers: [UserService],
    bootstrap: [AppComponent],
})
export class AppModule {}
