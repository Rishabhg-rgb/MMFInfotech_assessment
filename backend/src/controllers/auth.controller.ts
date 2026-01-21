import { Request, Response, NextFunction } from 'express';
import Employee from '../models/employee.model';
import Role from '../models/role.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { signToken, jwtVerifyAsync } from '../utils/jwtHelper';
import Env from '../constant/env';
import { EmployeeRequest, IDecodedJwt } from '../interfaces/extra';

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { employeeId, name, email, department, password, passwordConfirm } = req.body;

  // Password confirmation check (yup already validates this, but keeping for extra safety)
  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Get default role (Employee)
  const role = await Role.findOne({ name: 'Employee' });
  if (!role) {
    return next(new AppError('Default role not found', 500));
  }

  const employee = await Employee.create({
    employeeId,
    name,
    email,
    department,
    password,
    roleId: role._id,
  });

  const token = signToken(employee._id.toString());

  res.status(201).json({
    status: 'success',
    token,
    data: {
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        role: role.name,
      },
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const employee = await Employee.findOne({ email }).select('+password').setOptions({ skipRolePopulate: true });

  if (!employee || !(await employee.correctPassword(employee.password!, password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(employee._id.toString());

  res.status(200).json({
    status: 'success',
    token,
    data: {
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department,
      },
    },
  });
});

export const protect = catchAsync(async (req: EmployeeRequest, res: Response, next: NextFunction) => {
  let token;

  // Extract token from headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Validate presence of token
  if (!token) {
    return next(new AppError('Authentication token is missing. Please log in to access.', 401));
  }

  // Validate the token
  let decoded;
  try {
    const options = { issuer: Env.JWT_ISSUER_NAME };
    console.log(options,"here otions",token)
    decoded = (await jwtVerifyAsync(token, Env.JWT_SECRET as string, options)) as IDecodedJwt;
  } catch (error) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }

  // Verify required fields in decoded payload
  if (!decoded || !decoded.id || !decoded.exp) {
    return next(new AppError('Invalid token structure. Please log in again.', 401));
  }

  // Check token expiration
  if (decoded.exp * 1000 < Date.now()) {
    return next(new AppError('Token has expired. Please log in again.', 401));
  }

  // Check if employee still exists
  const currentEmployee = await Employee.findById(decoded.id).select('+passwordChangedAt');
  if (!currentEmployee) {
    return next(new AppError('The employee associated with this token no longer exists.', 401));
  }

  // Check if employee changed password after the JWT was issued
  if (currentEmployee.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Employee recently changed password! Please log in again', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.employee = currentEmployee;
  next();
});

export const getMe = catchAsync(async (req: EmployeeRequest, res: Response, next: NextFunction) => {
  const employee = req.employee;

  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        roleId: employee.roleId,
      },
    },
  });
});

export const restrictTo = (...roles: string[]) => {
  return (req: EmployeeRequest, res: Response, next: NextFunction) => {
    if (!req.employee || !req.employee.roleId) {
      return next(new AppError('Employee role not found', 403));
    }

    // Check if employee's role has the required permissions
    // For simplicity, check if role name is in roles
    // In full implementation, check permissions array
    const employeeRole = req.employee.roleId as any; // Populated role
    if (!roles.includes(employeeRole.name)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};