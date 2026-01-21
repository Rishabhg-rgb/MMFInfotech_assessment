import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';
import AppError from './appError';
import catchAsync from './catchAsync';

// Validation schemas
export const signupSchema = yup.object().shape({
  employeeId: yup
    .string()
    .required('Employee ID is required')
    .min(1, 'Employee ID cannot be empty')
    .max(50, 'Employee ID cannot exceed 50 characters'),
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please provide a valid email address')
    .max(100, 'Email cannot exceed 100 characters'),
  department: yup
    .string()
    .required('Department is required')
    .oneOf(['IT', 'HR', 'Finance', 'Marketing', 'Sales'], 'Invalid department'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  passwordConfirm: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please provide a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password cannot be empty'),
});

export const createEmployeeSchema = yup.object().shape({
  employeeId: yup
    .string()
    .required('Employee ID is required')
    .min(1, 'Employee ID cannot be empty')
    .max(50, 'Employee ID cannot exceed 50 characters'),
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please provide a valid email address')
    .max(100, 'Email cannot exceed 100 characters'),
  department: yup
    .string()
    .required('Department is required')
    .oneOf(['IT', 'HR', 'Finance', 'Marketing', 'Sales'], 'Invalid department'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  passwordConfirm: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const markAttendanceSchema = yup.object().shape({
  employeeId: yup
    .string()
    .required('Employee ID is required')
    .length(24, 'Invalid employee ID format'), // MongoDB ObjectId length
  date: yup
    .date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['Present', 'Absent'], 'Status must be either Present or Absent'),
});

// Validation middleware
export const validateRequest = (schema: yup.ObjectSchema<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error: any) {
      const errors: string[] = [];
      if (error.inner) {
        error.inner.forEach((err: yup.ValidationError) => {
          errors.push(err.message);
        });
      } else {
        errors.push(error.message);
      }
      return next(new AppError(`Validation failed: ${errors.join(', ')}`, 400));
    }
  });
};