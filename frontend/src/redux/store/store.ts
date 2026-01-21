import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slice/authSlice';
import employeeSlice from '../slice/employeeSlice';
import attendanceSlice from '../slice/attendanceSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    employee: employeeSlice,
    attendance: attendanceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;