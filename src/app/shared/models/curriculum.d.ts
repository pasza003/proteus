export interface Curriculum {
  id: string;
  code: string;
  name: string;
  terms: number;
  requiredCredit: number;
}

export interface CurriculumSubjects {
  curriculumId: string;
  subjectId: string;
}

export interface CurriculumWithSubjects {
  curriculum: Curriculum;
  subjects: Subject[];
}
