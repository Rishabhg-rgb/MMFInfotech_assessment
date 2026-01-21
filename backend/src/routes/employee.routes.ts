import express from 'express';
import { createEmployee, getEmployees, getEmployee, deleteEmployee } from '../controllers/employee.controller';
import { protect, restrictTo } from '../controllers/auth.controller';
import { validateRequest, createEmployeeSchema } from '../utils/validation';

const router = express.Router();

router.route('/').post(protect, restrictTo('Admin'), validateRequest(createEmployeeSchema), createEmployee).get(protect, getEmployees);
router.route('/:id').get(protect, getEmployee).delete(protect, restrictTo('Admin'), deleteEmployee);

export default router;