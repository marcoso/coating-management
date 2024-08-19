import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  loginForm: FormGroup;
  submitted = false;
  error = '';
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      password: ['', Validators.required]
    });
  }
  get formControls() {
    return this.loginForm.controls;
  }
  onSubmit() {
    debugger;
    this.submitted = true;
    this.error = '';
    if (this.loginForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      this.subs.sink = this.authService
        .login(this.formControls.email.value, this.formControls.password.value)
        .subscribe(
          (res) => {
            if (res.token) {
              const token = this.authService.currentUserValue.token;
              if (token) {
                this.router.navigate(['projects/my-projects']);
              }
            } else if (res.error) {
              this.error = res.error;
            }
          },
          (error) => {
            this.error = error;
            this.submitted = false;
          }
        );
    }
  }
}
