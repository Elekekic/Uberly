import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  errorMessage: string = '';

  constructor(private authSrv: AuthService, private router: Router) { }

  login(form: NgForm) {
    const { email, password } = form.value;
    this.authSrv.login({ email, password }).subscribe(
      () => {
        alert('Login successful!');
        this.router.navigate(['/home']);
      },
      (error: HttpErrorResponse) => {
        console.error('Error logging in:', error);
        let errorMessage = 'An error occurred during login.';
        
        if (error.status === 403) {
          errorMessage = 'Access denied. Please check your credentials.';
        } else if (error.error && typeof error.error === 'object') {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }
        
        this.errorMessage = errorMessage;
      }
    );
  }
}