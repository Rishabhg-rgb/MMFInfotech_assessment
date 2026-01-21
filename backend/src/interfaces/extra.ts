import { Request } from 'express';
import { IEmployee } from '../models/employee.model';

export interface EmployeeRequest extends Request {
  employee?: IEmployee;
}

export interface IDecodedJwt {
  id: string;
  iat: number;
  exp: number;
}