import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthsupportService } from '../../authsupport.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  myform: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authSopportService: AuthsupportService
   ) { }


  login(){
    const { email, password } = this.myform.value;

    this.authSopportService.login( email, password ).subscribe( ok => {
      if( ok === true ){
        this.router.navigateByUrl('/support/dashboard');
      }else {
        Swal.fire('Error', ok, 'error')
      }
    })
  }

  ngOnInit(): void {
  }

}
