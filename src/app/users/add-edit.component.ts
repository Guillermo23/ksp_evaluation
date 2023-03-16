import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AlertService } from '../_services';
import { MustMatch } from '../_helpers/must-match.validator';
import { User } from '../_models';

@Component({ templateUrl: 'add-edit.component.html' })

export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;
    myDateValue: Date | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };
        this.form = this.formBuilder.group({
            id: [''],
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            fullName: ['', Validators.required],
            relationship: ['', Validators.required],
            birthday: ['', Validators.required],
            sex: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            password: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
            confirmPassword: ['', this.isAddMode ? Validators.required : Validators.nullValidator]
        }, formOptions);

        if (!this.isAddMode) {
            this.userService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        let newUser = new User;
        newUser.email = this.form.value.email;
        newUser.firstName = this.form.value.firstName;
        newUser.lastName = this.form.value.lastName;
        newUser.title = this.form.value.title;
        newUser.role = this.form.value.role;
        newUser.beneficiary = {
            fullName: this.form.value.fullName,
            relationship: this.form.value.relationship,
            birthdate: this.form.value.birthdate,
            sex: this.form.value.sex,
        };
        console.log(newUser, this.form.value);
        this.userService.create(newUser)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('User added', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    private updateUser() {
        this.userService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('User updated', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }
}