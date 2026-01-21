export interface LoginInterface {
  email: string;
  password: string;
}

export interface SignupInterface {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  password: string;
  passwordConfirm: string;
}

export interface EmployeeInterface {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  password: string;
  passwordConfirm: string;
}

export interface AttendanceInterface {
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent';
}