import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from'../services/authentication.service';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';
@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.css'],
imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnInit {
public formErrors: string = '';
public credentials = {
 name: '',
 email: '',
 password: ''
};
constructor(
 private router: Router,
 private authenticationService: AuthenticationService,
) { }
ngOnInit() {}
public onLoginSubmit(): void {
 this.formErrors = '';
 if (!this.credentials.email || !this.credentials.password) {
 this.formErrors = 'All fields are required, please try again';
 } else {
 this.doLogin();
 }
 }
private doLogin(): void {
 this.authenticationService.login(this.credentials)
 .then(() => this.router.navigateByUrl('#'))
 .catch((message) => this.formErrors = message);
 }
} 