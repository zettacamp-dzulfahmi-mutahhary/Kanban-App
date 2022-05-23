import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth) { }

  defaultImg = environment.defaultImg;
  user = this.afAuth.currentUser;

  ngOnInit(): void {
    console.log(this.user);
    
  }

}
