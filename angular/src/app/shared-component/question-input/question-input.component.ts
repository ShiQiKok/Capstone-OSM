import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    faQuestionCircle,
    faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { faEllipsisV, faUpload } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentService } from 'src/services/assessment.service';

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
    @Input() dismissAllModel: boolean = true;
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
            value: { question: '', marks: 10 },
            isEdit: true,
        },
    ];

    totalMarks: number = 0;

    // icons
    faTrashAlt = faTrashAlt;
    faEllipsisV = faEllipsisV;
    faUpload = faUpload;
    faQuestionCircle = faQuestionCircle;

    uploadedFile!: File | null;
    isSubmitDisabled: boolean = true;

    constructor(
        private _assessmentService: AssessmentService,
        private _modalService: NgbModal
    ) {
        this._assessmentService.getApi();
    }

    ngOnInit(): void {
        if (!this.questions) {
            this.questions = this.template;
        }
        this.totalMarks = this.getTotalMark();
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

    openModal(modal: any) {
        this._modalService.open(modal);
    }

    onFileChange(file: FileList) {
        this.uploadedFile = file.item(0);
        this.isSubmitDisabled = false;
    }

    uploadQuestions(modal: any) {
        this._assessmentService
            .uploadQuestions(this.uploadedFile!)
            .then((obj) => {
                this.questions = obj as QuestionInput[];
                this.totalMarks = this.getTotalMark();
                if (this.dismissAllModel) this._modalService.dismissAll();
                else modal.close();
            });
    }

    setAllUneditable() {
        this.questions.forEach((q) => (q.isEdit = false));
        console.log(this.questions);
    }

    private getTotalMark() {
        return this.questions
            .map((q) => q.value?.marks)
            .reduce((a, b) => a! + b!)!;
    }
}
