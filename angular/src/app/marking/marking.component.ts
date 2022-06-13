import {
    Component,
    HostListener,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    faArrowAltCircleLeft,
    faCommentAlt,
} from '@fortawesome/free-regular-svg-icons';
import {
    faAngleLeft,
    faCheck,
    faInfo,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/helper/pending-changes.guard';
import {
    AnswerScript,
    AnswerScriptStatus,
    AnswerScriptStatusObj,
    Comment,
    HighlightText,
} from 'src/models/answerScript';
import {
    Assessment,
    AssessmentType,
    GradingMethod,
} from 'src/models/assessment';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { AssessmentService } from 'src/services/assessment.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { ViewSDKClient } from 'src/services/view-sdk.service';
import { AppComponent } from '../app.component';

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

class MarkDistribution {
    marksAwarded: number | undefined;
}

class Marks {
    markerId!: number;
    distribution!: MarkDistribution[];
    totalMark!: number;
}

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-marking',
    templateUrl: './marking.component.html',
    styleUrls: ['./marking.component.scss'],
})
export class MarkingComponent
    extends AppComponent
    implements OnInit, ComponentCanDeactivate
{
    // view references
    @ViewChild('generalCriteriaList') generalCriteriaList!: any;
    @ViewChild('detailCriteriaList') detailCriteriaList!: any;
    @ViewChild('floatingBar') floatToolbar!: any;

    // objects
    answerScript!: AnswerScript;
    assessment!: Assessment;
    selectedCriterion!: any;
    selectedCriterionIndex!: number;
    selectedDetailedCriterion!: any;
    marks!: Marks;
    initialMarksDistribution!: MarkDistribution[];
    initialComment!: Comment[];
    totalMarks: number = 0;
    commentFormControl = new FormControl('', [Validators.maxLength(300)]);
    previousSelected: any[] = [];

    // controls
    isEssayBased?: boolean = true;
    isRubricsUsed?: boolean = true;
    isRubricsDetailsShowed: boolean = false;
    isFloatingBarShowed: boolean = false;
    isSubmitted: boolean = false;
    isLoading: boolean = true;

    //icon
    faCheck = faCheck;
    faTimes = faTimes;
    faAngleLeft = faAngleLeft;
    faArrowAltCircleLeft = faArrowAltCircleLeft;
    faCommentAlt = faCommentAlt;
    faInfo = faInfo;

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        // if (!this.isSubmitted) {
        //     return (
        //         (JSON.stringify(this.marks.distribution) ===
        //         JSON.stringify(this.initialMarksDistribution)) &&
        //         (JSON.stringify(this.answerScript.comment)
        //             === JSON.stringify(this.initialComment))
        //     );
        // }
        return true;
    }

    constructor(
        router: Router,
        _authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private _answerScriptService: AnswerScriptService,
        private _assessmentService: AssessmentService,
        private viewSDKClient: ViewSDKClient,
        private _modalService: NgbModal
    ) {
        super(router, _authenticationService);
    }

    async ngOnInit() {
        this.isLoading = true;
        await this.loadApi();
        this.getDetail();
    }

    async loadApi() {
        await this._assessmentService.getApi();
        await this._answerScriptService.getApi();
    }

    checkControls() {
        if (this.assessment.type == AssessmentType.ESSAY_BASED)
            this.isEssayBased = true;
        else this.isEssayBased = false;

        if (this.assessment.grading_method == GradingMethod.RUBRICS)
            this.isRubricsUsed = true;
        else this.isRubricsUsed = false;

        console.log(this.isRubricsUsed);
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
            this.marks.distribution[this.selectedCriterionIndex].marksAwarded;

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
                    break;
                }
            }
        }
    }

    onDetailedCriteriaChanged() {
        this.selectedDetailedCriterion =
            this.detailCriteriaList.selectedOptions.selected[0].value;

        if (
            this.marks.distribution[this.selectedCriterionIndex].marksAwarded &&
            this.previousSelected[this.selectedCriterionIndex] !=
                this.selectedDetailedCriterion
        ) {
            this.marks.distribution[this.selectedCriterionIndex].marksAwarded =
                undefined;
            this.calculateTotalMark();
        }
        this.previousSelected[this.selectedCriterionIndex] =
            this.selectedDetailedCriterion;
    }

    getDetail() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this._answerScriptService.get(id).then((data) => {
            this.answerScript = data;
            this.initialComment = Object.assign({}, this.answerScript.comment);

            let j = this.answerScript.status!.findIndex(
                (s: AnswerScriptStatusObj) => {
                    return s.marker === this.currentUser.id;
                }
            );

            this.commentFormControl.setValue(
                this.answerScript.comment[j].comment
            );

            if (
                this.answerScript.status![j].status ==
                AnswerScriptStatus.NOT_STARTED
            ) {
                this.answerScript.status![j].status =
                    AnswerScriptStatus.IN_PROGRESS;
            }

            this.marks = data.marks.filter((obj: Marks) => {
                return obj.markerId == this.currentUser.id;
            })[0];
            this.initialMarksDistribution = JSON.parse(
                JSON.stringify(this.marks.distribution)
            );

            this._assessmentService
                .get(this.answerScript.assessment!)
                .then((obj) => {
                    this.assessment = obj;
                    this.checkControls();
                    if (this.isRubricsUsed){
                        for (
                            let i = 0;
                            i < this.assessment.rubrics.criterion.length;
                            i++
                        ) {
                            this.previousSelected.push(null);
                        }
                    }
                    this.isLoading = false;
                });

            if (this.answerScript.script) this.loadScript();
        });
    }

    private loadScript() {
        this.viewSDKClient.ready().then(() => {
            /* Invoke file preview */
            this.viewSDKClient.previewFile(
                'pdf-div',
                this.answerScript.script,
                // * set the Adobe Acrobat configuration
                // * check the API at https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_ui/
                {},
                this.answerScript.id!
            );
        });
    }

    // TODO: refine
    onMarkAwardedChanged(event: any, index: number) {
        let inputElement = event.target;
        let min: number = +inputElement.min;
        let max: number = +inputElement.max;
        let value: number = +inputElement.value;

        if (value < min) {
            inputElement.value = min;
            this.marks.distribution[index].marksAwarded = min;
        } else if (value > max) {
            inputElement.value = max;
            this.marks.distribution[index].marksAwarded = max;
        }

        this.calculateTotalMark();
    }

    private calculateTotalMark() {
        this.marks.totalMark = 0;
        for (let i = 0; i < this.marks.distribution.length; i++) {
            if (this.isRubricsUsed) {
                if (this.marks.distribution[i].marksAwarded) {
                    this.marks.totalMark +=
                        (this.marks.distribution[i].marksAwarded! *
                            this.assessment.rubrics.criterion[i].totalMarks) /
                        100;
                }
            } else {
                if (this.marks.distribution[i].marksAwarded) {
                    this.marks.totalMark +=
                        this.marks.distribution[i].marksAwarded!;
                }
            }
        }
    }

    private selection(): Selection {
        return window.getSelection()!;
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
                hasStartNodeMatched = true;
                startOffset += selection.anchorOffset;
            } else if (child === endNode) {
                endOffset +=
                    startOffset +
                    selection.focusOffset +
                    (startNode.textContent!.length - selection.anchorOffset);
                break;
            } else {
                hasStartNodeMatched
                    ? (endOffset += child.textContent!.length)
                    : (startOffset += child.textContent!.length);
            }
        }

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

    private checkIsMarkingFinished(): boolean {
        for (let obj of this.marks.distribution!) {
            if (obj.marksAwarded === null) return false;
        }
        return true;
    }

    onSubmit() {
        let j = this.answerScript.status!.findIndex(
            (s: AnswerScriptStatusObj) => {
                return s.marker === this.currentUser.id;
            }
        );
        this.checkIsMarkingFinished()
            ? (this.answerScript.status![j].status =
                  AnswerScriptStatus.FINISHED)
            : null;

        let i = this.answerScript.marks.findIndex((obj: Marks) => {
            return obj.markerId === this.currentUser.id;
        });

        if (i != -1) {
            this.answerScript.marks[i] = Object.assign({}, this.marks);
        }

        this._answerScriptService
            .update(this.answerScript.id!, this.answerScript)
            .then((obj) => {
                this.isSubmitted = true;
                this.router.navigate([
                    `/assessment-details/${this.assessment.id}`,
                ]);
            });
    }

    onGoBackClicked() {
        if (
            this.assessment.grading_method === GradingMethod.RUBRICS &&
            this.isRubricsDetailsShowed
        ) {
            this.isRubricsDetailsShowed = false;
        } else {
            this.router.navigate([`/assessment-details/${this.assessment.id}`]);
        }
    }

    get comment() {
        return this.commentFormControl;
    }

    updateComment() {
        if (this.commentFormControl.valid) {
            let comment = this.answerScript.comment.find((c) => {
                return c.marker == this.currentUser.id;
            });
            comment!.comment = this.commentFormControl.value;
            this._modalService.dismissAll();
        }
    }

    openModal(modal: any) {
        this._modalService.open(modal);
    }
}
