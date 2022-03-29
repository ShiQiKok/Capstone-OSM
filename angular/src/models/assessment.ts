// crete a class Assessment with the fields in Django AssessmentModel
export enum AssessmentType{
    QUESTION_BASED = 'question_based',
    ESSAY_BASED = 'essay_based'
}

export enum MarkingSettings{
    MARK_BY_SCRIPT = 'mark_by_script',
    MARK_BY_QUESTION = 'mark_by_question'
}

export class Assessment {
    id!: number;
    name!: string;
    subject!: number;
    type!: AssessmentType;
    marking_settings!: MarkingSettings;
    rubrics!: Rubrics;
    questions!: Question[];
}

export class Rubrics {
    levels!: string[];
    criteria!: RubricCriteria[];
}

export class RubricCriteria{
    title!: string;
    total_marks!: number;
    levels!: RubricCriteriaLevels[];
}

export class RubricCriteriaLevels{
    name!: string;
    description!: string;
    mark_range!: any;
}

// create a class Question with the fields question, answer, mark
export class Question {
    question!: string;
    answer!: string;
    mark!: number;
}
