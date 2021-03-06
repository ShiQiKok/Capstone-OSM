export enum AnswerScriptStatus {
    IN_PROGRESS = 'In Progress',
    FINISHED = 'Finished',
    NOT_STARTED = 'Not Started',
}

export class AnswerScriptStatusObj {
    marker!: number;
    status!: AnswerScriptStatus;
}

export class AnswerScript {
    id?: number;
    student_name?: string;
    student_id?: string;
    script?: string;
    assessment?: number;
    dateCreated?: Date;
    dateUpdated?: Date;
    marks!: Mark[];
    answers?: Answer[];
    status?: AnswerScriptStatusObj[];
    comment!: Comment[];
}

export class Comment {
    marker!: number;
    comment?: string;
}

export class Answer {
    marksAwarded?: number;
    answer?: string;
    highlightTexts?: HighlightText[];
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

export class MarkDistribution {
    marksAwarded: number | undefined;
}

export class Mark {
    markerId!: number;
    distribution!: MarkDistribution[];
    totalMark!: number;
}