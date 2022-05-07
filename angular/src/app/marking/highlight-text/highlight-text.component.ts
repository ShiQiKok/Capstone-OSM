import { Component, EventEmitter, Input, ViewEncapsulation, Output, SimpleChanges, OnChanges } from '@angular/core';
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
        let content: string = this.answer.answer;

        this.answer.highlightTexts.forEach((obj: HighlightText) => {
            this.content = `${content.substring(0, obj.start)}<span class="${obj.highlighterClass}">${content.substring(obj.start, obj.end)}</span>${content.substring(obj.end, content.length)}`
            // console.log(`start: ${obj.start}, end: ${obj.end}`);
            // console.log(content.substring(0, obj.start));
            // console.log(content.substring(obj.start, obj.end));
            // console.log(content.substring(obj.end, content.length));
        })

    }

}
