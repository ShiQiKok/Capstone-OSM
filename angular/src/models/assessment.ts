import { Subject } from './subject';

// crete a class Assessment with the fields in Django AssessmentModel
export enum AssessmentType {
    QUESTION_BASED = 'question_based',
    ESSAY_BASED = 'essay_based',
}

export enum MarkingSettings {
    MARK_BY_SCRIPT = 'mark_by_script',
    MARK_BY_QUESTION = 'mark_by_question',
}

export class Assessment {
    id?: number | undefined;
    name?: string | undefined;
    subject?: number | undefined;
    type?: AssessmentType | undefined;
    marking_settings?: MarkingSettings | undefined;
    rubrics?: any | undefined;
    questions?: any | undefined;
    markers?: number[] | undefined;
}

export class Rubrics {
    marksRange!: RubricMarkRange[];
    criteria!: RubricCriterion[];
}

export class RubricMarkRange {
    min?: number | undefined;
    max?: number | undefined;
}

export class RubricCriterion {
    title?: string | undefined;
    description?: string | undefined;
    totalMarks?: number | undefined;
    markAwarded?: number | undefined;
    columns?: RubricColumn[] | undefined;
}

export class RubricColumn {
    description?: string | undefined;
}

export class RubricCriteriaLevels {
    name!: string;
    description!: string;
    mark_range!: any;
}

// create a class Question with the fields question, answer, mark
export class Question {
    question?: string | null;
    answer?: string | null;
    mark?: number | null;
}
