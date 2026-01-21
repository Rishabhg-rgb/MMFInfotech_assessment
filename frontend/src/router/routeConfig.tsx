import { lazy } from 'react';
import type { RouteItem } from './type';

// Lazy load pages
const Login = lazy(() => import('../pages/Auth/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Employees = lazy(() => import('../pages/Employees/Employees'));
const EmployeeDetails = lazy(() => import('../pages/EmployeeDetails/EmployeeDetails'));
const Attendance = lazy(() => import('../pages/Attendance/Attendance'));
const Unauthorized = lazy(() => import('../pages/Error/Unauthorized'));

export const routes: RouteItem[] = [
  {
    path: '/login',
    element: Login,
    isProtected: false,
  },
  {
    path: '/',
    element: Dashboard,
    isProtected: true,
  },
  {
    path: '/employees',
    element: Employees,
    isProtected: true,
  },
  {
    path: '/employees/:id',
    element: EmployeeDetails,
    isProtected: true,
  },
  {
    path: '/attendance',
    element: Attendance,
    isProtected: true,
  },
  {
    path: '/unauthorized',
    element: Unauthorized,
    isProtected: false,
  },
];