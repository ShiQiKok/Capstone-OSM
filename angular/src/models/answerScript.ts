

export enum AnswerScriptStatus{
    IN_PROGRESS = 'In Progress',
    FINISHED = 'Finished',
    NOT_STARTED = 'Not Started'
}

export class AnswerScriptStatusObj{
    marker!: number;
    status!: AnswerScriptStatus;

}

export class AnswerScript{
    id?: number | undefined;
    studentName?: string | undefined;
    studentId?: string | undefined;
    status?: AnswerScriptStatusObj[] | undefined;
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