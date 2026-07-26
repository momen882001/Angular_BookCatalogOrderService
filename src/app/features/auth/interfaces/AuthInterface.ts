import { UserRoleEnum } from '../../../shared/enums/UserRoleEnum';

export interface IRegisterRequest {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  role: UserRoleEnum;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  userId: number;
  token: string;
  firstname: string;
  lastname: string;
  username: string;
  role: UserRoleEnum;
}
