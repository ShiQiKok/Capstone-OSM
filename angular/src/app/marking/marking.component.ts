import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerScript } from 'src/models/answerScript';
import { AnswerScriptService } from 'src/services/answer-script.service';
import { ViewSDKClient } from 'src/services/view-sdk.service';

@Component({
    selector: 'app-marking',
    templateUrl: './marking.component.html',
    styleUrls: ['./marking.component.scss'],
})
export class MarkingComponent implements OnInit {
    answerScript!: AnswerScript;

    constructor(
        private route: ActivatedRoute,
        private _answerScriptService: AnswerScriptService,
        private viewSDKClient: ViewSDKClient
    ) {}

    async ngOnInit() {
        await this._answerScriptService.getApi();
        this.getDetail();
    }

    getDetail() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this._answerScriptService.get(id).then((data) => {
            this.answerScript = data;
        });
    }

    ngAfterViewInit() {
        this.viewSDKClient.ready().then(() => {
            /* Invoke file preview */
            this.viewSDKClient.previewFile('pdf-div', {
                /* Pass the embed mode option here */
                embedMode: 'IN_LINE'
            });
        });
    }
}
