import {
    Component,
    EventEmitter,
    Input,
    ViewEncapsulation,
    Output,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { HighlightText } from 'src/models/answerScript';

// export class HighLightText {
//     toHighlight?: string | undefined;
//     matches?: string[] | undefined;
//     matchesIndex?: number | undefined;
//     highlighterClass?: string[] | undefined;
// }

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-highlight-text',
    styleUrls: ['./highlight-text.component.scss'],
    template: `
        <div class="border p-4 bg-white lh-lg" [innerHTML]="content"></div>
    `,
})
export class HighlightTextComponent {
    @Input() answer: any;

    content!: any;

    constructor() {}

    ngOnChanges() {
        this.content = this.answer.answer;
        this.answer.highlightTexts ? this.findMatches() : null;
    }

    findMatches() {
        let sorted = [...this.answer.highlightTexts];
        sorted.sort((a: HighlightText, b: HighlightText) => {
            return b.start - a.start;
        });

        sorted.forEach((obj: HighlightText) => {
            if (obj.highlighterClass.includes('highlight-correct')){
                this.content = `${this.content.substring(
                    0,
                    obj.start
                )}<span class="${obj.highlighterClass}">${this.content.substring(
                    obj.start,
                    obj.end
                )}</span>${this.content.substring(obj.end, this.content.length)}`;
            } else {
                this.content = `${this.content.substring(
                    0,
                    obj.start
                )}<mark class="${obj.highlighterClass}">${this.content.substring(
                    obj.start,
                    obj.end
                )}</mark>${this.content.substring(obj.end, this.content.length)}`;
            }
        });
    }
}
