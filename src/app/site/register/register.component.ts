import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  remember: boolean = false;
  msgError: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      remember: this.remember
    });
    
   }

  ngOnInit(): void {
  }

  get firstNameNotValid(){
    return this.registerForm.get('firstName')?.invalid && this.registerForm.get('firstName')?.touched;
  }

  get lastNameNotValid(){
    return this.registerForm.get('lastName')?.invalid && this.registerForm.get('lastName')?.touched;
  }

  get emailNotValid(){
    return this.registerForm.get('email')?.invalid && this.registerForm.get('email')?.touched;
  }

  get passwordNotValid(){
    return this.registerForm.get('password')?.invalid && this.registerForm.get('password')?.touched;
  }


  register(){
    if (this.registerForm.invalid) {
      return Object.values(this.registerForm.controls).forEach(control => {
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

    this.remember = this.registerForm.value.remember;

    this.auth.signUp(this.registerForm.value)
    .subscribe( resp => {

      Swal.close();

      Swal.fire({
       title: 'Email cadastrado',
       text: resp['email'],
       confirmButtonText: 'Ok',
       icon: 'success'
     }).then((result) => {
      if (result.isConfirmed) {

        if(this.remember){
          localStorage.setItem('email', resp['email']);
        }

        this.router.navigateByUrl('/dividas');

      }
    });


    }, (err) => {

      if (err.error.error.message == 'EMAIL_EXISTS') {
        this.msgError = 'Email existente';
      } else {
        this.msgError = err.error.error.message;
      }
      
      Swal.fire({
        title: 'Erro ao cadastrar-se',
        text: this.msgError,
        icon: 'error'
      });
      
    });
    
    this.registerForm.reset();
  }

}
