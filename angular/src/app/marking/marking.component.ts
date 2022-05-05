import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerScript } from 'src/models/answerScript';
import { Assessment, AssessmentType } from 'src/models/assessment';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { AssessmentService } from 'src/services/assessment.service';
import { ViewSDKClient } from 'src/services/view-sdk.service';
import { TextSelectEvent } from '../directives/text-select-directive.directive';

class FloatingBarPosition {
    top!: number;
    left!: number;
    width!: number;
    height!: number;
}

@Component({
    selector: 'app-marking',
    templateUrl: './marking.component.html',
    styleUrls: ['./marking.component.scss'],
})
export class MarkingComponent implements OnInit {
    @ViewChild('generalCriteriaList') generalCriteriaList!: any;
    @ViewChild('detailCriteriaList') detailCriteriaList!: any;
    @ViewChild('floatingBar') floatToolbar!: any;

    // objects
    answerScript!: AnswerScript;
    assessment!: Assessment;
    selectedCriterion!: any;
    selectedCriterionIndex!: number;
    selectedDetailedCriterion!: any;
    floatingBarPosition!: FloatingBarPosition;

    totalMarks: number = 0;

    // controls
    isEssayBased?: boolean = true;
    isRubricsDetailsShowed: boolean = false;
    isFloatingBarShowed: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private _answerScriptService: AnswerScriptService,
        private _assessmentService: AssessmentService,
        private viewSDKClient: ViewSDKClient
    ) {}

    async ngOnInit() {
        await this.loadApi();
        this.getDetail();
    }

    async loadApi() {
        await this._assessmentService.getApi();
        await this._answerScriptService.getApi();
    }

    checkControls() {
        if (this.assessment.type === AssessmentType.ESSAY_BASED)
            this.isEssayBased = true;
        else this.isEssayBased = false;
    }

    onGeneralCriteriaChanged() {
        // update the control flag
        this.isRubricsDetailsShowed = true;

        // get the selected criterion json
        this.selectedCriterion =
            this.generalCriteriaList.selectedOptions.selected[0]?.value;

        // get the selected criterion index
        this.selectedCriterionIndex = this.generalCriteriaList.options._results.findIndex((x: any) => {
            return x === this.generalCriteriaList.selectedOptions.selected[0]
        })

        // Expand the selected criterion
        let m = this.answerScript.answers[this.selectedCriterionIndex].marksAwarded
        if (m != null) {
            for (
                let i = 0;
                i < this.assessment.rubrics.marksRange.length;
                i++
            ) {
                if (
                    m >= this.assessment.rubrics.marksRange[i].min &&
                    m <= this.assessment.rubrics.marksRange[i].max
                ) {
                    this.selectedDetailedCriterion =
                        this.selectedCriterion.columns[i];
                }
            }
        }
    }

    onDetailedCriteriaChanged() {
        this.selectedDetailedCriterion =
            this.detailCriteriaList.selectedOptions.selected[0].value;
    }

    getDetail() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this._answerScriptService.get(id).then((data) => {
            this.answerScript = data;
            this._assessmentService
                .get(this.answerScript.assessment!)
                .then((obj) => {
                    this.assessment = obj;

                    this.checkControls();
                });
            if (this.answerScript.script) this.loadScript();
        });
    }

    loadScript() {
        this.viewSDKClient.ready().then(() => {
            /* Invoke file preview */
            this.viewSDKClient.previewFile(
                'pdf-div',
                this.answerScript.script,
                // {enableAnnotationAPIs: true, includePDFAnnotations: false}
                // * set the Adobe Acrobat configuration
                // * check the API at https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_ui/
                {},
                this.answerScript.id!
            );
        });
    }

    // TODO: refine
    onMarkAwardedChanged(event: any) {
        let inputElement = event.target;
        let min: number = +inputElement.min;
        let max: number = +inputElement.max;
        let value: number = +inputElement.value;

        if (value < min) {
            inputElement.value = min;
        } else if (value > max) {
            inputElement.value = max;
        }

        this.answerScript.marks = 0;
        for (let i = 0; i < this.answerScript.answers.length; i++) {
            if (this.isEssayBased)
                this.answerScript.marks += this.answerScript.answers[i].marksAwarded * this.assessment.rubrics.criterion[i].totalMarks / 100;
            else
                this.answerScript.marks += this.answerScript.answers[i].marksAwarded;
        }

    }

    onSubmit() {
        console.log(this.answerScript.answers);
        this._answerScriptService
            .update(this.answerScript.id!, this.answerScript)
            .then((obj) => {
                console.log(obj);
            });
    }
}
