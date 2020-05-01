import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];


  // this.forbiddenNames.bind(this) - bind(this), because we use 'this' inside a method 'forbiddenNames'
  // this.forbiddenEmails - we don't need bind(this) because we don't use 'this'  inside a method 'forbiddenEmails'
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });
    this.signupForm.valueChanges.subscribe(
      (value) => console.log(value)
    );
    this.signupForm.statusChanges.subscribe(
      (value) => console.log(value)
    );
    this.signupForm.setValue({
        'userData': {
          'username': 'Max',
          'email': 'max@test.com'
        },
        'gender': 'male',
        'hobbies': []
      }
    );
    this.signupForm.patchValue({
        'userData': {
          'username': 'Anna'
        }
      }
    );
  }

  onSubmit() {
    console.log('signupForm: ', this.signupForm);
    console.log('this.signupForm.getRawValue(): ', this.signupForm.getRawValue());
    const keys = Object.keys(this.signupForm.getRawValue());
    console.log('keys: ', keys)

    this.signupForm.reset();
  }

  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    } else {
      return null;
    }
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }

  onSetValue() {
    this.signupForm.setValue({
        'userData': {
          'username': 'SettedValue',
          'email': 'SettedValue@mail.com'
        },
        'gender': 'male',
        'hobbies': ['Cooking', 'Tennis']
      }, {emitEvent: false} // For disabling valueChanges/statusChanges event emitting
    );
  }

  onPatchValue() {
    this.signupForm.patchValue({
        'userData': {
          'email': 'PatchedValue@mail.com'
        },
        'hobbies': ['PatchedValue']
      }, {emitEvent: false} // For disabling valueChanges/statusChanges event emitting
    );
  }
}
