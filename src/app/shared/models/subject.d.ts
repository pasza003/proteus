export type SignupTypes = 'Kötelező' | 'Szabadon választható' | 'Kötelezően választható';
export type RequirementType = 'Gyakorlati jegy' | 'Kollokvium';
export interface Subject {
  uuid: string;
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
