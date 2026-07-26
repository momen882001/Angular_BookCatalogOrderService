import { UserRoleEnum } from '../../../shared/enums/UserRoleEnum';
import { IBookResponse } from '../../books/interfaces/BookInterface';

export interface IUserResponse {
  id: number;
  firstname: string;
  lastname: string;
  createdAt: string;
  books: IBookResponse[] | null;
  username: string;
  role: UserRoleEnum;
}
