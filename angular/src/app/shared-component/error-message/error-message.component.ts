import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
    selector: 'error-message',
    template: ` <div
        *ngIf="
            formControl.invalid && (formControl.dirty || formControl.touched)
        "
        class="text-danger"
    >
        <small>{{ errorMessage }}</small>
    </div>`,
})
export class ErrorMessageComponent implements OnInit {
    @Input() formControl!: FormControl;

    errorMessage: string = '';

    constructor() {}

    ngOnInit(): void {
        this.formControl.valueChanges.subscribe(() => {
            this.getFormValidationErrors();
        });
        this.getFormValidationErrors();
    }

    getFormValidationErrors() {
        let keys = this.formControl.errors;
        if (keys) {
            Object.keys(keys).forEach((key) => {
                switch (key) {
                    case 'required': {
                        this.errorMessage = 'This field is required.';
                        break;
                    }
                    case 'pattern': {
                        this.errorMessage = 'Please enter a valid email.';
                        break;
                    }
                    case 'maxlength': {
                        this.errorMessage = `Do not exceed ${
                            keys![key].requiredLength
                        } words.`;
                        break;
                    }
                }
            });
        }
    }
}
