export const SignupTypeMap = {
  REQUIRED: 'Kötelező',
  OPTIONAL: 'Szabadon választható',
  SEMI_REQUIRED: 'Kötelezően választható',
};
export type SignupTypes = (typeof SignupTypeMap)[keyof typeof SignupTypeMap];

export const RequirementTypeMap = {
  PRACTICAL: 'Gyakorlati jegy',
  EXAM: 'Kollokvium',
};
export type RequirementType = (typeof RequirementTypeMap)[keyof typeof RequirementTypeMap];

export interface Subject {
  id: string;
  name: string;
  code: string;
  signupType: SignupTypes;
  requirementType: RequirementType;
  interiorOrganization: string;
  // administrativeOrganization: string;
  recommendedTerm: number;
  credit: number;
  classesPerWeek?: ClassesPerWeek[];
}

export interface ClassesPerWeek {
  courseType: string;
  classesPerWeek: number;
}
