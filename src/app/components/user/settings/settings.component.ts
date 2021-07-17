import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Gender } from 'src/app/models/constants';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  cities: string[] = ['Bhopal', 'Lucknow', 'Mumbai', 'Jaipur', 'Panji', 'Ranchi'];
  states: string[] = ['MP', 'UP', 'MH', 'RJ', 'GA', 'JK'];
  countries: string[] = ['India'];
  isLoading = true;
  isLoadingError = false;
  form!: FormGroup;
  currentUser: any;
  submitted: boolean = false;
  genders = Gender;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastService: ToastService,
    private utility: UtilityService,
    private authenticationService: AuthenticationService
  ) {
    // Current user value
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.userService.getUserById(this.currentUser._id).subscribe(
      (currentUser: any) => {
        if (currentUser !== null && currentUser !== undefined) {
          this.createUserForm(currentUser);
          this.isLoading = false;
          this.isLoadingError = false;
        }
      },
      ((error: any) => {
        this.isLoading = false;
        this.isLoadingError = true;
      })
    );
  }

  createUserForm(currentUser: any) {
    this.form = this.formBuilder.group({
      id: [currentUser._id],
      firstName: [currentUser.firstName, Validators.required],
      lastName: [currentUser.lastName, Validators.required],
      dob: [{ value: this.utility.convertDateFormat(currentUser.dob), disabled: true }],
      gender: [{ value: currentUser.gender, disabled: true }],
      email: [{ value: currentUser.email, disabled: true }],
      phone: [currentUser.phone, Validators.required],
      country: [currentUser.country || '0', Validators.required],
      state: [currentUser.state || '0', Validators.required],
      city: [currentUser.city || '0', Validators.required],
      pincode: [currentUser.pincode, Validators.required],
      profession: [currentUser.profession, Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  get f() {
    return this.form.controls;
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  changePassword() {
    if (this.form.value.password === undefined || this.form.value.password === '' || (this.form.value.password).length !== 8) {
      this.toastService.danger("Please enter 8 character password!");
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.toastService.danger("Password entered do not match!");
      return;
    }

    this.userService.updateUser(this.form.value).subscribe(() => {
      this.ngOnInit();
    });
  }

  onSubmit() {
    let detailsToUpdate = {
      id: this.form.value.id,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      phone: this.form.value.phone,
      city: this.form.value.city,
      state: this.form.value.state,
      country: this.form.value.country,
      pincode: this.form.value.pincode,
      profession: this.form.value.profession
    };

    this.userService.updateUser(detailsToUpdate).subscribe(() => {
      this.ngOnInit();
    });
  }
}
