import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IEmployee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  roleId: {
    _id: string;
    name: string;
  };
}

interface IPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalDocuments: number;
}

interface IEmployeeState {
  loading: boolean;
  data: IEmployee[];
  pagination: IPagination;
  currentEmployee: IEmployee | null;
}

const initialState: IEmployeeState = {
  loading: false,
  data: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalDocuments: 0,
  },
  currentEmployee: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEmployees: (state, action: PayloadAction<{ data: IEmployee[]; pagination: IPagination }>) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    addEmployee: (state, action: PayloadAction<IEmployee>) => {
      state.data.unshift(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<IEmployee>) => {
      const index = state.data.findIndex(emp => emp._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(emp => emp._id !== action.payload);
    },
    setCurrentEmployee: (state, action: PayloadAction<IEmployee | null>) => {
      state.currentEmployee = action.payload;
    },
  },
});

export const {
  setLoading,
  setEmployees,
  addEmployee,
  updateEmployee,
  removeEmployee,
  setCurrentEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;