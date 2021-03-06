import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent  {
  isLoading = false;

  constructor(public authService: AuthService) {}
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value.birthdate);
    
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password, form.value.name, form.value.birthdate.toString(), form.value.birthplace, form.value.phone);
  }


}
