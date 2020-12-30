import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  remember: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
      remember: this.remember
    });

   }

  ngOnInit(): void {

    if(localStorage.getItem('email')){
      this.loginForm.get('email')?.setValue(localStorage.getItem('email'));
      this.loginForm.get('remember')?.setValue(true);
    }

  }

  get emailNotValid(){
    return this.loginForm.get('email')?.invalid && this.loginForm.get('email')?.touched;
  }

  login(){
    if (this.loginForm.invalid) {
      return Object.values(this.loginForm.controls).forEach(control => {
        if(control instanceof FormGroup){ 
          return Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      })
    }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere, por favor...',
      icon: 'info'
    });
    Swal.showLoading();

    this.remember = this.loginForm.value.remember;

    this.auth.login(this.loginForm.value)
    .subscribe(resp => {

      Swal.close();

      if(this.remember){
        localStorage.setItem('email', resp['email']);
      }

      this.router.navigateByUrl('/dividas');
    }, (err) => {
      console.log();
      Swal.fire({
        title: 'Falha ao autenticar',
        text: 'Verifique seus dados',
        icon: 'error'
      });
    });
    
    this.loginForm.reset();

  }

}
