import {
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerScript } from 'src/models/answerScript';
import { Assessment, AssessmentType } from 'src/models/assessment';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { AssessmentService } from 'src/services/assessment.service';
import { ViewSDKClient } from 'src/services/view-sdk.service';
import { TextSelectEvent } from '../directives/text-select-directive.directive';

class FloatingBarPosition{
    top!: number;
    left!: number;
    width!: number;
    height!: number;
}

interface SelectionRectangle {
	left: number;
	top: number;
	width: number;
	height: number;
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
    selectedDetailedCriterion!: any;
    floatingBarPosition!: FloatingBarPosition;

    totalMarks: number = 0;

    // controls
    isEssayBased?: boolean = true;
    isRubricsDetailsShowed: boolean = false;
    isFloatingBarShowed: boolean = false;

    // TEXT SELECTION
    // public hostRectangle: SelectionRectangle | null;
	// private selectedText: string;

    constructor(
        private route: ActivatedRoute,
        private _answerScriptService: AnswerScriptService,
        private _assessmentService: AssessmentService,
        private viewSDKClient: ViewSDKClient
    ) {
        // this.hostRectangle = null;
		// this.selectedText = "";
    }

    async ngOnInit() {
        await this.loadApi();
        this.getDetail();
    }

    // ngAfterViewChecked() {
    //     // get element with class 'answer-box'
    //     let answerDivs = document.getElementsByClassName('answer-box');
    //     if (answerDivs.length > 0) {
    //         for (let element of answerDivs) {
    //             element.addEventListener('mouseup', (event: any) => {
    //                 event.stopImmediatePropagation();

    //                 let selection = window.getSelection();
    //                 let localRectPosition = selection?.getRangeAt(0).getBoundingClientRect()
    //                 this.floatingBarPosition = {
    //                     top: localRectPosition!.top,
    //                     left: localRectPosition!.left,
    //                     width: localRectPosition!.width,
    //                     height: localRectPosition!.height
    //                 }
    //                 console.log(this.floatingBarPosition);
    //                 // setTimeout((() => {
    //                 //     let toolbar = document.querySelector('ngb-popover-window')!;
    //                 //     toolbar.removeAttribute('style');

    //                 //     // // toolbar.setAttribute('style', 'background-color: red; transform: translate(100px, 100px)')


    //                 //     console.log(toolbar)
    //                 // }), 1000)

    //             });

    //             element.addEventListener('mousedown', (event: any) => {
    //                 event.stopImmediatePropagation();
    //                 this.isFloatingBarShowed = false;

    //                 // toolbar!.setAttribute('style', `background-color: red; position: absolute; top: ${this.floatingBarPosition.top}; left: ${this.floatingBarPosition.left};`);
    //             });
    //         }
    //     }
    // }
    // public renderRectangles( event: TextSelectEvent ) : void {

	// 	console.group( "Text Select Event" );
	// 	console.log( "Text:", event.text );
	// 	console.log( "Viewport Rectangle:", event.viewportRectangle );
	// 	console.log( "Host Rectangle:", event.hostRectangle );
	// 	console.groupEnd();

	// 	// If a new selection has been created, the viewport and host rectangles will
	// 	// exist. Or, if a selection is being removed, the rectangles will be null.
	// 	if ( event.hostRectangle ) {

	// 		this.hostRectangle = event.hostRectangle;
	// 		this.selectedText = event.text;

	// 	} else {

	// 		this.hostRectangle = null;
	// 		this.selectedText = "";

	// 	}

	// }

    // onTextSelect(){
    //     console.group( "Shared Text" );
	// 	console.log( this.selectedText );
	// 	console.groupEnd();

	// 	// Now that we've shared the text, let's clear the current selection.
	// 	document.getSelection()!.removeAllRanges();
	// 	// CAUTION: In modern browsers, the above call triggers a "selectionchange"
	// 	// event, which implicitly calls our renderRectangles() callback. However,
	// 	// in IE, the above call doesn't appear to trigger the "selectionchange"
	// 	// event. As such, we need to remove the host rectangle explicitly.
	// 	this.hostRectangle = null;
	// 	this.selectedText = "";
    // }

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
        this.isRubricsDetailsShowed = true;
        this.selectedCriterion =
            this.generalCriteriaList.selectedOptions.selected[0]?.value;

        // Expand the selected criterion
        if (this.selectedCriterion.markAwarded) {
            let m = this.selectedCriterion.markAwarded;
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

                    this.assessment.rubrics.criterion.forEach((c: any) => {
                        if (c.markAwarded)
                            this.totalMarks +=
                                (c.markAwarded * c.totalMarks) / 100;
                    });
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
        if (this.isEssayBased){
            this.assessment.rubrics.criterion.forEach((c: any) => {
                if (c.markAwarded)
                    this.answerScript.marks += (c.markAwarded * c.totalMarks) / 100;
            });
        } else {
            this.answerScript.answers.forEach((a: any) => {
                this.answerScript.marks += a.marksAwarded;
            })
        }

    }

    onSubmit() {
        // this._assessmentService
        //     .update(this.assessment.id!, this.assessment)
        //     .then(() => {
        //         console.log('updated');
        //     });

        this._answerScriptService
            .update(this.answerScript.id!, this.answerScript)
            .then((obj) => {
                console.log(obj);
            })
    }
}
