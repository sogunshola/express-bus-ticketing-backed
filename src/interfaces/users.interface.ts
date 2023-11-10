export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
