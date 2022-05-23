import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  type: 'login' | 'signup' | 'reset' = 'signup';
  isLoading = false;
  isAuthenticated = false;

  form: FormGroup;

  errorMessage: string;

  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', []],
    });

    this.afAuth.authState.subscribe((user) => {
      this.isAuthenticated = user ? true : false;
    });
  }

  changeType(val) {
    this.type = val;
  }

  // Type Getters
  get isLogin() {
    return this.type === 'login';
  }

  get isSignUp() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  // Forms Getter
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmit() {
    this.isLoading = true;

    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        await this.afAuth.signInWithEmailAndPassword(email, password);
      }
      if (this.isSignUp) {
        await this.afAuth.createUserWithEmailAndPassword(email, password);
      }
      if (this.isPasswordReset) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.errorMessage = 'Email Has Been Sent, Please Check Your Email !';
      }
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case 'auth/user-not-found':
          this.errorMessage = 'User not Found, Please Sign Up';
          break;
        case 'auth/email-already-exists':
          this.errorMessage = 'User Already Exist, Please Login';
          break;
        case 'auth/email-already-in-use':
          this.errorMessage =
            'Email Already Exist, Please Login or Sign Up with other email';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Wrong Email or Password';
          break;
        default:
          this.errorMessage = 'An Error Occured';
      }
    }

    this.isLoading = false;
  }
}
