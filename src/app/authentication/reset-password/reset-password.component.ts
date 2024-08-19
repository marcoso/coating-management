import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResetPassword } from 'src/app/core/models/reset-password';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    resetPwdForm: FormGroup;
    submitted = false;
    key: string;
    userId: string;
  
    constructor(
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private authService: AuthService,
      private snackBar: MatSnackBar
    ) {}
    
    ngOnInit() {
      this.resetPwdForm = this.formBuilder.group({        
            password: ['', [Validators.required, Validators.minLength(5)]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: this.mustMatch('password', 'confirmPassword')
        });

        this.activatedRoute.paramMap.subscribe((parameters : ParamMap)=> {
            if(parameters.has('key')) {   
                this.key = parameters.get('key');                
                this.authService.getUserFromKey(this.key)			
                .subscribe(
                    (user) => this.userId = user.userId,
                    (error: HttpErrorResponse) => { this.showErrorNotification(); }
                );            
            }        
        });      
    }
  
    get formControls() {
      return this.resetPwdForm.controls;
    }

    mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
    
            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator already found an error on the matchingControl
                return;
            }
    
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }
    
    onSubmit() {      
      this.submitted = true;    
      if (this.resetPwdForm.invalid) {
        return;
      } else {     
          if(this.userId && this.key){
            const data = new ResetPassword(this.userId, this.formControls.confirmPassword.value, this.key);
            this.authService.resetPassword(data)
            .subscribe(
                (res) => {                  
                    this.showNotification(
                        'snackbar-success',
                        'Your password has been reset',
                        'bottom',
                        'center'
                    );
                    this.router.navigate(['authentication/signin']);             
                },
                (error: HttpErrorResponse) => {
                    this.showErrorNotification(error.message);
                    this.submitted = false;
                }
            );   
          }         
      }
    }

    showNotification(colorName, text, placementFrom, placementAlign) {
        this.snackBar.open(text, '', {
          duration: 2000,
          verticalPosition: placementFrom,
          horizontalPosition: placementAlign,
          panelClass: colorName
        });
      }

    showErrorNotification(error?: string) {
        this.showNotification(
            'snackbar-danger',
            error ? error : 'An error occurred, please try again.',
            'bottom',
            'center'
          );
      }
  }
