import { Request, Response, NextFunction } from 'express';
import Employee from '../models/employee.model';
import Role from '../models/role.model';
import APIFeatures, { PaginationInfo } from '../utils/appFeatures';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const createEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

  // Check for duplicates
  const existing = await Employee.findOne({ $or: [{ employeeId }, { email }] });
  if (existing) {
    return next(new AppError('Employee ID or Email already exists', 400));
  }

  const employee = await Employee.create({ employeeId, name, email, department, password, roleId: role._id });

  res.status(201).json({
    status: 'success',
    data: employee,
  });
});

export const getEmployees = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const features = new APIFeatures(Employee.find(), req.query)
    .filter()
    .search('name', 'email', 'department')
    .sort()
    .limitFields()
    .paginate();

  const employees = await features.query;
  const pagination = await PaginationInfo.exec(Employee.countDocuments(), req.query, features.rawQuery());

  res.status(200).json({
    status: 'success',
    results: employees.length,
    pagination,
    data: employees,
  });
});

export const getEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const employee = await Employee.findById(req.params.id).populate('roleId', 'name');

  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: employee,
  });
});

export const deleteEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});