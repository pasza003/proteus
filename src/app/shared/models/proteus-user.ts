export interface ProteusUser {
  email: string;
  password: string;
  code: string;
  role: 'USER' | 'ADMIN';
}
