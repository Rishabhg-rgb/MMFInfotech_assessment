import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IAttendance {
  _id: string;
  employeeId: {
    _id: string;
    employeeId: string;
    name: string;
    department: string;
  };
  date: string;
  status: 'Present' | 'Absent';
  createdAt: string;
}

interface IPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalDocuments: number;
}

interface IAttendanceState {
  loading: boolean;
  data: IAttendance[];
  pagination: IPagination;
}

const initialState: IAttendanceState = {
  loading: false,
  data: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalDocuments: 0,
  },
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAttendance: (state, action: PayloadAction<{ data: IAttendance[]; pagination: IPagination }>) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    addAttendance: (state, action: PayloadAction<IAttendance>) => {
      state.data.unshift(action.payload);
    },
  },
});

export const { setLoading, setAttendance, addAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;