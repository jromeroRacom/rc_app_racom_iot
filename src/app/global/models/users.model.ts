export interface UserModel {
  id: number;
  email: string;
  password: string;
  name: string;
  state: boolean;
  token?: string;
  expiration?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  roleId?: number;
  role?: Role;
}

export interface Role {
  id: number;
  role: string;
}
