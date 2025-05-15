export interface Organisation {
  id: string;
  code: string;
  city: string;
  name: string;
  omCode: string;
  postCode: string;
  street: string;
}

export interface OrganisationCurriculums {
  organisationId: string;
  curriculumId: string;
}

export interface OrganisationWithCurriculums {
  organisation: Organisation;
  curriculums: Curriculum[];
}
