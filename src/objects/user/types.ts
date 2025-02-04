// Import types
import type { RoleModelType } from "../auth/types";

export type UserModelType = {
  id?: string | number;
  roleId?: string | number;
  email?: string;
  firstName: string;
  lastName: string;
  username?: string;
  hashedPassword?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserType = Omit<UserModelType, "hashedPassword" | "roleId"> & {
  role: RoleModelType;
};

export type SignInUserType = {
  username: string;
  password: string;
};

export type SignUpUserType = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmedPassword: string;
};

export type AuthenticationDataType = {
  user: UserType;
  token: string;
};
