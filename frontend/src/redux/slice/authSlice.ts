import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initializeAuthAsync } from './authThunks';

export interface IEmployee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  roleId: {
    _id: string;
    name: string;
    permissions: Array<{
      resource: string;
      actions: string[];
    }>;
  };
}

interface IAuthState {
  isAuthenticated: boolean;
  employee: IEmployee | null;
  token: string | null;
  loading: boolean;
}

const initialState: IAuthState = {
  isAuthenticated: !!localStorage.getItem('authToken'),
  employee: null,
  token: localStorage.getItem('authToken'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ employee: IEmployee; token: string }>) => {
      state.isAuthenticated = true;
      state.employee = action.payload.employee;
      state.token = action.payload.token;
      state.loading = false;
      localStorage.setItem('authToken', action.payload.token);
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.employee = null;
      state.token = null;
      localStorage.removeItem('authToken');
    },
    setEmployee: (state, action: PayloadAction<IEmployee>) => {
      state.employee = action.payload;
    },
    initializeAuth: (state, action: PayloadAction<IEmployee>) => {
      state.isAuthenticated = true;
      state.employee = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuthAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.employee = action.payload;
      })
      .addCase(initializeAuthAsync.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.employee = null;
        state.token = null;
        localStorage.removeItem('authToken');
      });
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setEmployee, initializeAuth } = authSlice.actions;
export default authSlice.reducer;