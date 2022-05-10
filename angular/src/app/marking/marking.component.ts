import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerScript, HighlightText } from 'src/models/answerScript';
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

class CustomSelection {
    anchorNode: Node;
    anchorOffset: number;
    focusNode: Node;
    focusOffset: number;

    constructor(
        anchorNode: Node,
        anchorOffset: number,
        focusNode: Node,
        focusOffset: number
    ) {
        this.anchorNode = anchorNode;
        this.anchorOffset = anchorOffset;
        this.focusNode = focusNode;
        this.focusOffset = focusOffset;
    }
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
        this.selectedCriterionIndex =
            this.generalCriteriaList.options._results.findIndex((x: any) => {
                return (
                    x === this.generalCriteriaList.selectedOptions.selected[0]
                );
            });

        // Expand the selected criterion
        let m =
            this.answerScript.answers![this.selectedCriterionIndex]
                .marksAwarded;
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
        for (let i = 0; i < this.answerScript.answers!.length; i++) {
            if (this.isEssayBased)
                this.answerScript.marks +=
                    (this.answerScript.answers![i].marksAwarded! *
                        this.assessment.rubrics.criterion[i].totalMarks) /
                    100;
            else
                this.answerScript.marks +=
                    this.answerScript.answers![i].marksAwarded;
        }
    }

    private selection(): Selection {
        return window.getSelection()!;
    }

    private selectedText(): string {
        return window.getSelection()!.toString();
    }

    private checkSelection(selection: Selection) {
        let swap = false;
        if (selection.focusNode != selection.anchorNode) {
            let parent = selection.anchorNode!.parentElement!.closest('div')!;

            for (let child of parent.childNodes) {
                if (
                    child === selection.anchorNode ||
                    child === selection.anchorNode!.parentElement
                ) {
                    swap = false;
                    break;
                } else if (
                    child === selection.focusNode ||
                    child === selection.focusNode!.parentElement
                ) {
                    swap = true;
                    break;
                }
            }
        } else if (selection.focusOffset < selection.anchorOffset) {
            swap = true;
        }

        if (swap) {
            return new CustomSelection(
                selection.focusNode!,
                selection.focusOffset,
                selection.anchorNode!,
                selection.anchorOffset
            );
        } else {
            return new CustomSelection(
                selection.anchorNode!,
                selection.anchorOffset,
                selection.focusNode!,
                selection.focusOffset
            );
        }
    }

    highlightText(classNames: string[]) {
        let selection: CustomSelection = this.checkSelection(this.selection());
        let startNode = selection.anchorNode!;
        let endNode = selection.focusNode!;

        if (startNode.parentElement!.tagName.toLowerCase() === 'span')
            startNode = startNode.parentElement!;
        if (endNode.parentElement!.tagName.toLowerCase() === 'span')
            endNode = endNode.parentElement!;

        let children = startNode.parentElement!.closest('div')!.childNodes;
        let startOffset = 0;
        let endOffset = 0;

        // calculate the offsets
        // console.log(children);
        // console.log(selection);
        let hasStartNodeMatched = false;
        // if the selection is within the same node
        for (let child of children) {
            if (child === startNode && child === endNode) {
                // console.log(1);
                startOffset += selection.anchorOffset;
                children.length === 1
                    ? (endOffset = selection.focusOffset)
                    : (endOffset =
                          startOffset +
                          selection.focusOffset -
                          selection.anchorOffset);
                break;
            } else if (child === startNode) {
                // console.log(2);
                hasStartNodeMatched = true;
                startOffset += selection.anchorOffset;
            } else if (child === endNode) {
                endOffset +=
                    startOffset +
                    selection.focusOffset +
                    (startNode.textContent!.length - selection.anchorOffset);
                // console.log(3);
                break;
            } else {
                // console.log(4);
                hasStartNodeMatched
                    ? (endOffset += child.textContent!.length)
                    : (startOffset += child.textContent!.length);
            }
        }
        console.log(startOffset, endOffset);

        // find the index of the highlighted component
        let highlightTextComponent =
            this.selection().anchorNode!.parentElement!.closest(
                '.highlight-text-container'
            );
        let i = Array.from(
            document.querySelectorAll('app-highlight-text')
        ).findIndex((element) => {
            return element === highlightTextComponent;
        });

        // remove the in-between highlightText object
        let tempArray = this.answerScript.answers![i].highlightTexts;
        if (tempArray) {
            for (let obj of tempArray) {
                // if the new selection is within a highlighted section
                if (
                    this.isInBetween([obj.start, obj.end], startOffset) &&
                    this.isInBetween([obj.start, obj.end], endOffset)
                ) {
                    this.answerScript.answers![i].highlightTexts! =
                        this.removeObj(
                            this.answerScript.answers![i].highlightTexts!,
                            obj
                        );
                    let splitObj1 = new HighlightText(
                        obj.start,
                        startOffset,
                        obj.highlighterClass
                    );
                    let splitObj2 = new HighlightText(
                        endOffset,
                        obj.end,
                        obj.highlighterClass
                    );
                    this.answerScript.answers![i].highlightTexts?.push(
                        splitObj1,
                        splitObj2
                    );
                }
                // if the new selection contains a highlighted section
                else if (
                    this.isInBetween([startOffset, endOffset], obj.start) &&
                    this.isInBetween([startOffset, endOffset], obj.end)
                ) {
                    this.answerScript.answers![i].highlightTexts! =
                        this.removeObj(
                            this.answerScript.answers![i].highlightTexts!,
                            obj
                        );
                }
                // if the new selection's start is within a highlighted section
                else if (this.isInBetween([obj.start, obj.end], startOffset)) {
                    this.answerScript.answers![i].highlightTexts! =
                        this.removeObj(
                            this.answerScript.answers![i].highlightTexts!,
                            obj
                        );
                    let splitObj = new HighlightText(
                        obj.start,
                        startOffset,
                        obj.highlighterClass
                    );
                    this.answerScript.answers![i].highlightTexts?.push(
                        splitObj
                    );
                }
                // if the new selection's end is within a highlighted section
                else if (this.isInBetween([obj.start, obj.end], endOffset)) {
                    this.answerScript.answers![i].highlightTexts! =
                        this.removeObj(
                            this.answerScript.answers![i].highlightTexts!,
                            obj
                        );
                    let splitObj = new HighlightText(
                        endOffset,
                        obj.end,
                        obj.highlighterClass
                    );
                    this.answerScript.answers![i].highlightTexts?.push(
                        splitObj
                    );
                }
            }
        }

        // add the new highlightText object
        let highlighter: HighlightText = new HighlightText(
            startOffset,
            endOffset,
            classNames
        );

        if (this.answerScript.answers![i].highlightTexts)
            this.answerScript.answers![i].highlightTexts = [
                ...this.answerScript.answers![i].highlightTexts!,
                highlighter,
            ];
        else this.answerScript.answers![i].highlightTexts = [highlighter];

        // reassign the object to trigger ngOnChange in highlightTexts component
        this.answerScript.answers![i] = Object.assign(
            {},
            this.answerScript.answers![i]
        );
    }

    /*
        Check if set2 is entirely contained within set1.
        @param set1: [startIndex: number, endIndex: number]
        @param set2: [startIndex: number, endIndex: number]
    */
    private isInBetween(set: [number, number], num: number) {
        if (num >= set[0] && num <= set[1]) return true;
        return false;
    }

    private removeObj(array: Array<any>, obj: any) {
        array = array.filter((element) => element != obj);
        return array;
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
