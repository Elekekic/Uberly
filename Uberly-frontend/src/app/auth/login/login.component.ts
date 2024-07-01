import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authSrv: AuthService, private router: Router) { }

  login(form:NgForm){
    try {
      this.authSrv.login(form.value).subscribe();
      alert ('Sign up successful! ')
      this.router.navigate(['/home'])
    } catch (error) {
      console.error(error)
      return;
    }
  }
}