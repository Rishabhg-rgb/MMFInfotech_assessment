import express, { Express } from 'express';
import employeeRoutes from './employee.routes';
import attendanceRoutes from './attendance.routes';
import authRoutes from './auth.routes';

const router = express.Router();

router.use('/employees', employeeRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/auth', authRoutes);

const applyRoutes = (app: Express) => {
  app.use('/api/v1', router);
};

export default applyRoutes;