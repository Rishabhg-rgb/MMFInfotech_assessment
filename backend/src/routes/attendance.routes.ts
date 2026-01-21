import express from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller';
import { protect, restrictTo } from '../controllers/auth.controller';
import { validateRequest, markAttendanceSchema } from '../utils/validation';

const router = express.Router();

router.route('/').post(protect, restrictTo('Admin'), validateRequest(markAttendanceSchema), markAttendance);
router.route('/:employeeId').get(protect, getAttendance);

export default router;