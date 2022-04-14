import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerScript } from 'src/models/answerScript';
import { AnswerScriptService } from 'src/services/answer-script.service';

@Component({
    selector: 'app-marking',
    templateUrl: './marking.component.html',
    styleUrls: ['./marking.component.scss'],
})
export class MarkingComponent implements OnInit {
    answerScript!: AnswerScript;

    constructor(
        private route: ActivatedRoute,
        private _answerScriptService: AnswerScriptService
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
}
