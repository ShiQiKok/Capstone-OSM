import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

class RubricsInput {
    marksRange?: RubricMarkRangeInput[] | undefined;
    isEdit?: boolean | undefined; // control to edit marks range
    criterion?: RubricCriterionInput[] | undefined;
}

class RubricCriterionInput {
    title?: string | undefined;
    description?: string | undefined;
    totalMarks?: number | undefined;
    columns?: RubricColumnInput[] | undefined;
    isEdit?: boolean | undefined;
}

class RubricColumnInput {
    description?: string | undefined;
}

class RubricMarkRangeInput {
    min?: number | undefined;
    max?: number | undefined;
}

@Component({
    selector: 'app-rubrics-input',
    templateUrl: './rubrics-input.component.html',
    styleUrls: ['./rubrics-input.component.scss'],
})
export class RubricsInputComponent implements OnInit {
    @Input() rubrics!: RubricsInput;
    @Output() rubricsChange = new EventEmitter<RubricsInput>();

    constructor() {
    }

    ngOnInit(): void {
        console.log(this.rubrics)

        if (!this.rubrics) {
            let temp = {
                marksRange: [
                    { min: 0, max: 39 },
                    { min: 40, max: 49 },
                    { min: 50, max: 59 },
                    { min: 60, max: 69 },
                    { min: 70, max: 100 },
                ],
                isEdit: false,
                criterion: [
                    {
                        title: 'criteria 1',
                        description: 'desc for criteria 1',
                        totalMarks: 25,
                        isEdit: false,
                        columns: [
                            {
                                description: 'desc for col 1 in criteria 1',
                            },
                            {
                                description: 'desc for col 2 in criteria 1',
                            },
                            {
                                description: 'desc for col 3 in criteria 1',
                            },
                            {
                                description: 'desc for col 4 in criteria 1',
                            },
                            {
                                description: 'desc for col 5 in criteria 1',
                            },
                        ],
                    },
                    {
                        title: 'criteria 2',
                        description: 'desc for criteria 2',
                        totalMarks: 25,
                        isEdit: false,
                        columns: [
                            {
                                description: 'desc for col 1 in criteria 2',
                            },
                            {
                                description: 'desc for col 2 in criteria 2',
                            },
                            {
                                description: 'desc for col 3 in criteria 2',
                            },
                            {
                                description: 'desc for col 4 in criteria 2',
                            },
                            {
                                description: 'desc for col 5 in criteria 2',
                            },
                        ],
                    },
                    {
                        title: 'criteria 3',
                        description: 'desc for criteria 3',
                        totalMarks: 25,
                        isEdit: false,
                        columns: [
                            {
                                description: 'desc for col 1 in criteria 3',
                            },
                            {
                                description: 'desc for col 2 in criteria 3',
                            },
                            {
                                description: 'desc for col 3 in criteria 3',
                            },
                            {
                                description: 'desc for col 4 in criteria 3',
                            },
                            {
                                description: 'desc for col 5 in criteria 3',
                            },
                        ],
                    },
                    {
                        title: 'criteria 4',
                        description: 'desc for criteria 4',
                        totalMarks: 25,
                        isEdit: false,
                        columns: [
                            {
                                description: 'desc for col 1 in criteria 4',
                            },
                            {
                                description: 'desc for col 2 in criteria 4',
                            },
                            {
                                description: 'desc for col 3 in criteria 4',
                            },
                            {
                                description: 'desc for col 4 in criteria 4',
                            },
                            {
                                description: 'desc for col 5 in criteria 5',
                            },
                        ],
                    },
                ],

            };
            this.rubricsChange.emit(temp);
        }
    }


    getRubricsMarksRange(): any {
        if (this.rubrics && this.rubrics.criterion) {
            return [
                'criteria',
                ...this.rubrics.marksRange!.map((c) => {
                    return c;
                }),
            ];
        }
        return [];
    }

    getRubricsMarksRangeString(): string[] {
        if (this.rubrics && this.rubrics.criterion) {
            return [
                'criteria',
                ...this.rubrics.marksRange!.map((c) => {
                    return `${c.min} - ${c.max}`;
                }),
            ];
        }
        return [];
    }

    addRubricsRow(event: any): void {
        event.stopPropagation();
        // this.setUneditable();
        let len = this.rubrics.marksRange!.length;
        let row: RubricCriterionInput = {
            title: 'criteria ' + (this.rubrics.criterion!.length + 1),
            description: '',
            totalMarks: 0,
            isEdit: true,
            columns: [],
        };
        for (let i = 0; i < len; i++) {
            row.columns!.push({
                description: '',
            });
        }
        this.rubrics.criterion = [...this.rubrics.criterion!, row];
    }

    addRubricsColumn(event: any): void {
        event.stopPropagation();
        this.rubrics.marksRange = [
            ...this.rubrics.marksRange!,
            { min: 0, max: 0 },
        ];

        this.rubrics.criterion!.forEach((c: any) => {
            c.columns!.push({
                description: 'yea',
            });
        });
    }

    setUneditable(): void {
        this.rubrics.isEdit = false;
        this.rubrics.criterion!.forEach((criteria: any) => {
            criteria.isEdit = false;
        });
        console.log('esf')
        this.rubricsChange.emit(this.rubrics);
    }
}
