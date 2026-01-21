import { Request, Response, NextFunction } from 'express';
import Attendance from '../models/attendance.model';
import Employee from '../models/employee.model';
import APIFeatures, { PaginationInfo } from '../utils/appFeatures';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { EmployeeRequest } from '../interfaces/extra';

export const markAttendance = catchAsync(async (req: EmployeeRequest, res: Response, next: NextFunction) => {
  const { employeeId, date, status } = req.body;

  // Validate employee exists
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }

  // Check if attendance already marked for this date
  const existing = await Attendance.findOne({ employeeId, date: new Date(date) }).setOptions({ skipEmployeePopulate: true });
  if (existing) {
    return next(new AppError('Attendance already marked for this date', 400));
  }

  const attendance = await Attendance.create({ employeeId, date: new Date(date), status });

  res.status(201).json({
    status: 'success',
    data: attendance,
  });
});

export const getAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { employeeId } = req.params;

  const features = new APIFeatures(Attendance.find({ employeeId }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const attendance = await features.query;
  const pagination = await PaginationInfo.exec(Attendance.countDocuments({ employeeId }), req.query, features.rawQuery());

  res.status(200).json({
    status: 'success',
    results: attendance.length,
    pagination,
    data: attendance,
  });
});