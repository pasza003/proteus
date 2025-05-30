export interface ProteusUser {
  email: string;
  password: string;
  code: string;
  organisation: string;
  curriculum: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterRequest {
  email: string;
  password: string;
  code: string;
  organisationId: string;
  curriculumId: string;
}
