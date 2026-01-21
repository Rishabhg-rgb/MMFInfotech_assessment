import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployee, getAttendance } from '../../apis';
import { setLoading as setEmployeeLoading } from '../../redux/slice/employeeSlice';
import { setLoading as setAttendanceLoading, setAttendance } from '../../redux/slice/attendanceSlice';
import type { RootState } from '../../redux/store/store';
import { Button, Loader } from '../../components';
import toast from 'react-hot-toast';

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [employee, setEmployee] = useState<any>(null);
  const [filter, setFilter] = useState<'thisMonth' | 'last3Months' | 'last6Months' | 'lastYear' | 'all'>('thisMonth');
  const { data: attendance, loading: attendanceLoading } = useSelector((state: RootState) => state.attendance);
//   const { employee: currentUser } = useSelector((state: RootState) => state.auth);

//   const isAdmin = currentUser?.roleId?.name === 'Admin';

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
      fetchEmployeeAttendance();
    }
  }, [id, filter]);

  const fetchEmployeeDetails = async () => {
    dispatch(setEmployeeLoading(true));
    try {
      const response = await getEmployee(id!);
      setEmployee(response.data.data);
    } catch (error: any) {
      toast.error('Failed to fetch employee details');
      navigate('/employees');
    } finally {
      dispatch(setEmployeeLoading(false));
    }
  };

  const fetchEmployeeAttendance = async () => {
    dispatch(setAttendanceLoading(true));
    try {
      const response = await getAttendance(id!);
      let filteredData = response.data.data;

      // Apply date filter
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      switch (filter) {
        case 'thisMonth':
          filteredData = filteredData.filter((record: any) => {
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
          });
          break;
        case 'last3Months':
          filteredData = filteredData.filter((record: any) => {
            const recordDate = new Date(record.date);
            const threeMonthsAgo = new Date(now);
            threeMonthsAgo.setMonth(now.getMonth() - 3);
            return recordDate >= threeMonthsAgo;
          });
          break;
        case 'last6Months':
          filteredData = filteredData.filter((record: any) => {
            const recordDate = new Date(record.date);
            const sixMonthsAgo = new Date(now);
            sixMonthsAgo.setMonth(now.getMonth() - 6);
            return recordDate >= sixMonthsAgo;
          });
          break;
        case 'lastYear':
          filteredData = filteredData.filter((record: any) => {
            const recordDate = new Date(record.date);
            const oneYearAgo = new Date(now);
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            return recordDate >= oneYearAgo;
          });
          break;
        case 'all':
        default:
          // No filtering
          break;
      }

      dispatch(setAttendance({
        data: filteredData,
        pagination: { page: 1, limit: filteredData.length, totalPages: 1, totalDocuments: filteredData.length },
      }));
    } catch (error: any) {
      toast.error('Failed to fetch attendance records');
    } finally {
      dispatch(setAttendanceLoading(false));
    }
  };

  const filterOptions = [
    { value: 'thisMonth', label: 'This Month' },
    { value: 'last3Months', label: 'Last 3 Months' },
    { value: 'last6Months', label: 'Last 6 Months' },
    { value: 'lastYear', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
  ];

  const presentCount = attendance.filter((record: any) => record.status === 'Present').length;
  const absentCount = attendance.filter((record: any) => record.status === 'Absent').length;
  const totalDays = attendance.length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  if (!employee) return <Loader />;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
          <p className="text-gray-600">Employee ID: {employee.employeeId}</p>
        </div>
        <Button
          onClick={() => navigate('/employees')}
          variant="secondary"
          className="px-4 py-2"
        >
          Back to Employees
        </Button>
      </div>

      {/* Employee Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-sm text-gray-900">{employee.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
            <p className="mt-1 text-sm text-gray-900">{employee.employeeId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{employee.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <p className="mt-1 text-sm text-gray-900">{employee.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-sm text-gray-900">{employee.roleId?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1 text-sm text-gray-900">{employee.phoneNumber || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <div className="text-sm text-gray-600">Present Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <div className="text-sm text-gray-600">Absent Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalDays}</div>
            <div className="text-sm text-gray-600">Total Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{attendancePercentage}%</div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Attendance Records</h2>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {attendanceLoading ? (
          <Loader />
        ) : attendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 text-xs font-medium">
                  <th className="py-3 pl-6">Attendance Date</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Recorded At</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {attendance.map((record: any) => (
                  <tr key={record._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="pl-6 py-4">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
                        record.status === 'Present' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No attendance records found for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;