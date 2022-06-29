// crete a class Assessment with the fields in Django AssessmentModel
export enum AssessmentType {
    QUESTION_BASED = 'question_based',
    ESSAY_BASED = 'essay_based',
}

export enum GradingMethod {
    RUBRICS = 'Rubrics',
    QUESTION = 'Questions',
}

export class Assessment {
    id?: number;
    name?: string;
    subject?: number;
    type?: AssessmentType;
    grading_method?: GradingMethod;
    rubrics?: Rubrics;
    questions?: Question[];
    markers?: number[];
}


// classes for questions and its sub-components
export class Question {
    no?: string | undefined;
    value?: QuestionValue | undefined;
    isEdit?: boolean | undefined;

    constructor(no: string, value: QuestionValue, isEdit: boolean) {
        this.no = no;
        this.value = value;
        this.isEdit = isEdit;
    }
}

export class QuestionValue {
    question?: string | undefined;
    marks?: number | undefined;
}

// classes for rubrics and its sub-components
export class Rubrics {
    marksRange?: RubricMarkRange[];
    totalMarks?: number;
    isEdit?: boolean; // control to edit marks range
    criterion?: RubricCriterion[];
}

export class RubricCriterion {
    title?: string | undefined;
    description?: string | undefined;
    totalMarks?: number | undefined;
    columns?: RubricColumn[] | undefined;
    isEdit?: boolean | undefined;
}

export class RubricColumn {
    description?: string | undefined;
}

export class RubricMarkRange {
    min?: number | undefined;
    max?: number | undefined;
}