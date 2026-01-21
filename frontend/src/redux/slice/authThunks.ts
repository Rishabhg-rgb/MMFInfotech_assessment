import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMe } from '../../apis';
import { initializeAuth } from './authSlice';

export const initializeAuthAsync = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await getMe();
      dispatch(initializeAuth(response.data.data.employee));
      return response.data.data.employee;
    } catch (error: any) {
      // If token is invalid, clear it
      localStorage.removeItem('authToken');
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);