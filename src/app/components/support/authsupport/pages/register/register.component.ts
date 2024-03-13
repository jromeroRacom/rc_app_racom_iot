import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthsupportService } from '../../authsupport.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  myform: UntypedFormGroup = this.fb.group({
    name:     ['', [Validators.required]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authSupportService: AuthsupportService,
   ) { }


  register(){
    const { name, email, password } = this.myform.value;

    this.authSupportService.register( name, email, password ).subscribe( ok => {
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
