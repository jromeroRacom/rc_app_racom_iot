import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthsupportService } from '../../support/authsupport/authsupport.service';

@Component({
  selector: 'headerdashb-support',
  templateUrl: './headerdashb-support.component.html',
  styles: [
  ]
})
export class HeaderdashbSupportComponent implements OnInit {

  get userSopport(){
    return this.authSupportService.userSupport.email;
  }

  constructor(
    private router: Router,
    private authSupportService: AuthsupportService
  ) { }

  logout(){
    this.router.navigateByUrl('/support/auth');
    this.authSupportService.logout();
  }
  ngOnInit(): void {
  }

}
