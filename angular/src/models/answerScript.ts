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
}