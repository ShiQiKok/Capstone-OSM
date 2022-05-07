export enum AnswerScriptStatus{
    IN_PROGRESS = 'IN PROGRESS',
    FINISHED = 'FINISHED',
    NOT_STARTED = 'NOT STARTED'
}

export class AnswerScript{
    id?: number | undefined;
    studentName?: string | undefined;
    studentId?: string | undefined;
    status?: AnswerScriptStatus | undefined;
    dateCreated?: Date | undefined;
    dateUpdated?: Date | undefined;
    marks?: any | undefined;
    questions?: any | undefined;
    answers?: Answer[] | undefined;
    script?: any | undefined;
    assessment?: number | undefined;
}

export class Answer {
    marksAwarded?: number | undefined;
    answer?: string | undefined;
    highlightTexts?: HighlightText[] | undefined;
}

export class HighlightText {
    start: number;
    end: number;
    highlighterClass: string[];

    constructor(start: number, end: number, highlighterClass: string[]) {
        this.start = start;
        this.end = end;
        this.highlighterClass = highlighterClass;
    }
}