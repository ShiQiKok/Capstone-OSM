import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerScript } from 'src/models/answerScript';
import { Assessment, AssessmentType } from 'src/models/assessment';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { AssessmentService } from 'src/services/assessment.service';
import { ViewSDKClient } from 'src/services/view-sdk.service';

@Component({
    selector: 'app-marking',
    templateUrl: './marking.component.html',
    styleUrls: ['./marking.component.scss'],
})
export class MarkingComponent implements OnInit {
    @ViewChild('generalCriteriaList') generalCriteriaList!: any;
    @ViewChild('detailCriteriaList') detailCriteriaList!: any;

    // objects
    answerScript!: AnswerScript;
    assessment!: Assessment;
    selectedCriterion!: any;
    selectedDetailedCriterion! : any;

    totalMarks: number = 0;

    // controls
    isEssayBased?: boolean = true;
    isRubricsDetailsShowed: boolean = false;

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
        if (this.assessment.type === AssessmentType.ESSAY_BASED) {
            this.isEssayBased = true;
        }
    }

    onGeneralCriteriaChanged() {
        this.isRubricsDetailsShowed = true;
        this.selectedCriterion = this.generalCriteriaList.selectedOptions.selected[0]?.value;

        // Expand the selected criterion
        if (this.selectedCriterion.markAwarded){
            let m = this.selectedCriterion.markAwarded
            for (let i = 0; i < this.assessment.rubrics.marksRange.length; i++){
                if (m >= this.assessment.rubrics.marksRange[i].min && m<= this.assessment.rubrics.marksRange[i].max){
                    this.selectedDetailedCriterion = this.selectedCriterion.columns[i]
                }
            }
        }
    }

    onDetailedCriteriaChanged() {
        this.selectedDetailedCriterion = this.detailCriteriaList.selectedOptions.selected[0].value
    }

    getDetail() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this._answerScriptService.get(id).then((data) => {
            this.answerScript = data;
            this._assessmentService
                .get(this.answerScript.assessment!)
                .then((obj) => {
                    this.assessment = obj;


                    this.assessment.rubrics.criterion.forEach((c: any) => {
                        if (c.markAwarded)
                            this.totalMarks += c.markAwarded * c.totalMarks / 100
                    })
                    this.checkControls();
                });
            this.loadScript();
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
                this.answerScript.id!,
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

        this.totalMarks = 0
        this.assessment.rubrics.criterion.forEach((c: any) => {
            if (c.markAwarded)
                this.totalMarks += c.markAwarded * c.totalMarks / 100
        })
    }

    onSubmit(){
        this._assessmentService.update(this.assessment.id!, this.assessment).then(() => {
            console.log('updated');
        })
    }

}
