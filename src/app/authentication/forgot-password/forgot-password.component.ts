import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]
      ]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }
  
  onSubmit() {      
    this.submitted = true;    
    if (this.loginForm.invalid) {
      return;
    } else {        
        this.authService.sendRecoverPasswordEmail(this.formControls.email.value)
        .subscribe(
            (res) => {                  
              if (res) {                
                this.success = true;              
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
