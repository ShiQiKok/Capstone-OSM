import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faUpload, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AssessmentService } from 'src/services/assessment.service';
import { faQuestionCircle, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { RubricCriterion, Rubrics } from 'src/models/assessment';

@Component({
    selector: 'app-rubrics-input',
    templateUrl: './rubrics-input.component.html',
    styleUrls: ['./rubrics-input.component.scss'],
})
export class RubricsInputComponent implements OnInit {
    @Input() rubrics!: Rubrics;
    @Input() isEditingMode!: boolean;
    @Input() dismissAllModel: boolean = true;
    @Output() rubricsChange = new EventEmitter<Rubrics>();
    @ViewChild(MatTable) table!: MatTable<any>;

    // icons
    faTrashAlt = faTrashAlt;
    faPlusCircle = faPlusCircle;
    faUpload = faUpload;
    faQuestionCircle = faQuestionCircle;

    // objects
    uploadedFile: File | null = null;
    isSubmitDisabled: boolean = true;
    addIconIndex!: number;
    template: Rubrics = {
        marksRange: [
            { min: 0, max: 39 },
            { min: 40, max: 49 },
            { min: 50, max: 59 },
            { min: 60, max: 69 },
            { min: 70, max: 100 },
        ],
        isEdit: false,
        totalMarks: 100,
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

    constructor(
        private _modalService: NgbModal,
        private _assessmentService: AssessmentService
    ) {
        this._assessmentService.getApi();
    }

    ngOnInit(): void {
        if (!this.rubrics) {
            this.rubrics = this.template;
        }
    }

    getColumnWidth() {
        let len = this.getRubricsMarksRange().length;
        let width = 100 / len;
        return `${width}%`;
    }

    showAddIconIndex(criterion: RubricCriterion, index: any) {
        if (index != 0) {
            this.addIconIndex = index;
        }
    }

    getRubricsMarksRange() {
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
        this.setUneditable();
        let len = this.rubrics.marksRange!.length;
        let row: RubricCriterion = {
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

    removeRubricsRow(event: any, obj: any) {
        event.stopPropagation();
        let index = this.rubrics.criterion!.indexOf(obj);

        if (index !== -1) {
            this.rubrics.criterion!.splice(index, 1);
        }

        this.table.renderRows();
        this.setUneditable();
    }

    addRubricsColumn(event: any): void {
        event.stopPropagation();
        this.setUneditable();

        this.rubrics.marksRange?.splice(this.addIconIndex, 0, {
            min: 0,
            max: 0,
        });

        this.rubrics.criterion!.forEach((criterion: any) => {
            criterion.columns!.splice(this.addIconIndex, 0, {
                description: undefined,
            });
        });

        this.rubrics.isEdit = true;
    }

    removeRubricsColumn(event: any) {
        event.stopPropagation();
        this.setUneditable();

        this.rubrics.marksRange?.splice(this.addIconIndex - 1, 1);
        this.rubrics.criterion!.forEach((criterion: any) => {
            criterion.columns!.splice(this.addIconIndex - 1, 1);
        });
        this.rubrics.isEdit = false;
    }

    onHeaderDoubleClick() {
        if (this.isEditingMode) {
            this.setUneditable();
            this.rubrics.isEdit = !this.rubrics.isEdit;
        }
    }

    onBodyDoubleClick(row: any) {
        if (this.isEditingMode) {
            this.setUneditable();
            row.isEdit = !row.isEdit;
        }
    }

    setUneditable(): void {
        this.rubrics.isEdit = false;
        this.rubrics.criterion!.forEach((criteria: any) => {
            criteria.isEdit = false;
        });
        this.calculateTotal();
    }

    private calculateTotal() {
        this.rubrics.totalMarks = 0;
        this.rubrics.criterion!.forEach((c) => {
            this.rubrics.totalMarks! += c.totalMarks!;
        });
    }

    openModal(modal: any) {
        this._modalService.open(modal);
    }

    onFileChange(file: FileList) {
        this.uploadedFile = file.item(0);
        this.isSubmitDisabled = false;
    }

    uploadRubrics(modal: any) {
        this._assessmentService
            .uploadRubrics(this.uploadedFile!)
            .then((obj) => {
                this.rubrics = obj;
                this.rubrics.isEdit = false;
                this.calculateTotal();
                this.table.renderRows();
                if (this.dismissAllModel) this._modalService.dismissAll();
                else modal.close();
            });
    }
}
