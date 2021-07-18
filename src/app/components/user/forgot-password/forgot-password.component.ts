import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  findAccountForm: FormGroup;
  forgotPasswordForm: FormGroup;
  identifyUserRoute: boolean = false;
  forgotPasswordRoute: boolean = false;
  loading = false;
  submitted = false;
  forgotPasswordFormSubmitted = false;
  foundUser!: User;
  returnUrl!: string;
  noUserFound: boolean = false;

  @Input('forgotPassword') forgotPassword !: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private toastService: ToastService,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService
  ) {

    this.findAccountForm = this.formBuilder.group({
      email: ['', Validators.required],
      dob: ['', Validators.required]
    });

    this.forgotPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      params.id && params.id == "identify" ? this.identifyUserRoute = true : this.identifyUserRoute = false;
      if (params.id && params.id == "recover")
        this.foundUser ? this.forgotPasswordRoute = true : this.router.navigate(['/login', 'identify']);
      else
        this.forgotPasswordRoute = false;
    });

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.findAccountForm.controls; }

  get forgotPasswordFormControls() { return this.forgotPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    // stop here if form is invalid
    if (this.findAccountForm.invalid) {
      return;
    }

    this.loading = true;
    this.noUserFound = false;

    this.userService.getUserByEmail(this.f.email.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loading = false;
          this.foundUser = this.findByDoB(data, this.f.dob.value);
          this.foundUser && this.router.navigate(['/login', 'recover']);
          !this.foundUser && (this.noUserFound = true);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  onPasswordReset() {

    this.forgotPasswordFormSubmitted = true;

    if (this.forgotPasswordForm.invalid)
      return;

    if (
      this.forgotPasswordForm.value.password === undefined ||
      this.forgotPasswordForm.value.password === '' ||
      (this.forgotPasswordForm.value.password).length <= 8) {
      this.toastService.danger("Please enter more than 8 characters password!");
      return;
    }

    if (this.forgotPasswordForm.value.password !== this.forgotPasswordForm.value.confirmPassword) {
      this.toastService.danger("Password entered do not match!");
      return;
    }

    let updateUserReqBody = {
      id: this.foundUser.id,
      password: this.forgotPasswordForm.value.password
    }

    if (this.forgotPasswordForm.value.password === this.forgotPasswordForm.value.password) {
      this.userService.updateUser(updateUserReqBody).subscribe((data) => {
        console.log(data);
      })
    }
  }

  findByDoB(userList: any, dob: any) {
    let foundUser = userList.find(
      (user: any) => {
        return (new Date(user.dob).setHours(0, 0, 0, 0) == new Date(dob).setHours(0, 0, 0, 0));
      });
    return foundUser;
  }

}


createdDate: "2021-07-15T19:11:48.562Z"
dob: "2021-07-15T19:11:48.562Z"
email: "virat.kohli@gmail.com"
firstName: "Virat"
gender: "Male"
id: "60f0887496257100049a7e4c"
isActive: true
isAdmin: false
lastName: "Kohli"
password: "$2a$10$nNtnGy2RNEdlXX/VcOXxqOdRgTpOzOnyUePhHQmZwBSb4Wx6IaTNy"
photoId: "60f0887496257100049a7e4b"
__v: 0
id: "60f0887496257100049a7e4c"