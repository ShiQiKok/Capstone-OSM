import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-spinner',
    template: `<mat-spinner
        *ngIf="isLoading"
        [strokeWidth]="2"
        [diameter]="150"
        class="mx-auto mt-5"
    ></mat-spinner> `,
})
export class SpinnerComponent {
    @Input() isLoading!: boolean;

    constructor() {}
}
