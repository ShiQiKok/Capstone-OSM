import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

class QuestionInput {
    no?: string | undefined;
    value?: QuestionValueInput | undefined;
    isEdit?: boolean | undefined;

    constructor(no: string, value: QuestionValueInput, isEdit: boolean) {
        this.no = no;
        this.value = value;
        this.isEdit = isEdit;
    }
}

class QuestionValueInput {
    question?: string | undefined;
    marks?: number | undefined;
}
@Component({
    selector: 'app-question-input',
    templateUrl: './question-input.component.html',
})
export class QuestionInputComponent implements OnInit {
    @Input() questions!: QuestionInput[];
    @Input() isEditingMode: boolean = true;
    @Output() questionsChange = new EventEmitter<QuestionInput[]>();

    questionDisplayedColumns: string[] = [
        'drag',
        'no',
        'question',
        'marks',
        'actions',
    ];

    questionReviewColumns: string[] = ['no', 'question', 'marks'];

    template: QuestionInput[] = [
        {
            no: '1',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
        {
            no: '2',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
        {
            no: '3',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
        {
            no: '4',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
        {
            no: '5',
            value: { question: 'descriptions...', marks: 10 },
            isEdit: false,
        },
    ];

    totalMarks: number = 0;

    faTrashAlt = faTrashAlt;
    faEllipsisV = faEllipsisV;

    constructor() {}

    ngOnInit(): void {
        if (!this.questions) {
            this.questions = this.template;
            this.totalMarks = this.getTotalMark();
        }
    }

    addQuestion() {
        let ques = new QuestionInput('', { question: '', marks: 0 }, true);
        this.questions = [...this.questions, ques];
    }

    updateQuestion(element: QuestionInput) {
        element.isEdit = !element.isEdit;

        this.totalMarks = this.getTotalMark();
    }

    deleteQuestion(element: QuestionInput) {
        this.questions = this.questions.filter((e) => e !== element);
    }

    private getTotalMark() {
        return this.questions
            .map((q) => q.value?.marks)
            .reduce((a, b) => a! + b!)!;
    }
}
