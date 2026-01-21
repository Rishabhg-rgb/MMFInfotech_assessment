import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees, getAttendance, markAttendance } from '../../apis';
import { setLoading, setEmployees } from '../../redux/slice/employeeSlice';
import { setLoading as setAttendanceLoading, setAttendance, addAttendance } from '../../redux/slice/attendanceSlice';
import type { RootState } from '../../redux/store/store';
import { Button, Select, Modal, Loader, Input } from '../../components';
import toast from 'react-hot-toast';

const Attendance: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState<'Present' | 'Absent'>('Present');
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);

  const dispatch = useDispatch();
  const { data: employees, loading: employeesLoading } = useSelector((state: RootState) => state.employee);
  const { data: attendance, loading: attendanceLoading } = useSelector((state: RootState) => state.attendance);
  const { employee: currentUser } = useSelector((state: RootState) => state.auth);

  const isAdmin = currentUser?.roleId?.name === 'Admin';

  useEffect(() => {
    if (isAdmin) {
      fetchEmployees();
      fetchAllAttendance();
    } else if (currentUser?._id) {
      fetchAttendance(currentUser._id);
    }
  }, [isAdmin, currentUser]);

  const fetchAllAttendance = async () => {
    dispatch(setAttendanceLoading(true));
    try {
      // For admin, fetch attendance for all employees
      const allAttendance = [];
      for (const emp of employees) {
        const response = await getAttendance(emp._id);
        if (response.data.status === 'success') {
          allAttendance.push(...response.data.data);
        }
      }
      dispatch(setAttendance({
        data: allAttendance,
        pagination: { page: 1, limit: allAttendance.length, totalPages: 1, totalDocuments: allAttendance.length },
      }));
    } catch (error: any) {
      toast.error('Failed to fetch attendance');
    } finally {
      dispatch(setAttendanceLoading(false));
    }
  };

  useEffect(() => {
    if (isAdmin && employees.length > 0) {
      fetchAllAttendance();
    }
  }, [employees, isAdmin]);

  const fetchEmployees = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getEmployees();
      dispatch(setEmployees({
        data: response.data.data,
        pagination: response.data.pagination,
      }));
    } catch (error: any) {
      toast.error('Failed to fetch employees');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchAttendance = async (employeeId: string) => {
    dispatch(setAttendanceLoading(true));
    try {
      const response = await getAttendance(employeeId);
      dispatch(setAttendance({
        data: response.data.data,
        pagination: response.data.pagination,
      }));
    } catch (error: any) {
      toast.error('Failed to fetch attendance');
    } finally {
      dispatch(setAttendanceLoading(false));
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedEmployee || !selectedDate || !selectedStatus) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const response = await markAttendance({
        employeeId: selectedEmployee,
        date: selectedDate,
        status: selectedStatus,
      });
      dispatch(addAttendance(response.data.data));
      if (isAdmin) {
        // Refetch all attendance to ensure data is populated correctly
        fetchAllAttendance();
      }
      setShowModal(false);
      setSelectedEmployee('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSelectedStatus('Present');
      toast.success('Attendance marked successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const employeeOptions = employees.map(emp => ({
    value: emp._id,
    label: `${emp.name} (${emp.employeeId})`,
  }));

  const statusOptions = [
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
  ];

  // Filter attendance by selected date
  const filteredAttendance = attendance.filter(record => 
    new Date(record.date).toISOString().split('T')[0] === viewDate
  );

  // Get present and absent employees
  const presentEmployees = filteredAttendance.filter(record => record.status === 'Present');
  const absentEmployees = filteredAttendance.filter(record => record.status === 'Absent');

  // Get employees not marked for the date
  const markedEmployeeIds = new Set(filteredAttendance.map(record => record.employeeId._id));
  const unmarkedEmployees = employees.filter(emp => !markedEmployeeIds.has(emp._id));

  if (employeesLoading || attendanceLoading) return <Loader />;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Attendance Overview
          </h3>
          <p className="text-gray-600 mt-2">
            View and manage attendance records for your team.
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <Input
              type="date"
              value={viewDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setViewDate(e.target.value)}
              className="w-40"
            />
          </div>
          {isAdmin && (
            <Modal
              button={
                <Button className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
                  Mark Attendance
                </Button>
              }
              isOpen={showModal}
              toggleModal={() => setShowModal(!showModal)}
              crossIcon
            >
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Mark Attendance</h2>
                </div>
                <Select
                  label="Employee"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  options={[{ value: '', label: 'Select' }, ...employeeOptions]}
                />
                <Input
                  label="Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                />
                <Select
                  label="Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as 'Present' | 'Absent')}
                  options={statusOptions}
                />
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleMarkAttendance}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Mark Attendance
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
      <div className="mt-12 space-y-8">
        {isAdmin ? (
          <>
            {/* Present Employees */}
            <div>
              <h4 className="text-lg font-semibold text-green-600 mb-4">Present Employees ({presentEmployees.length})</h4>
              {presentEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {presentEmployees.map((record) => (
                    <div key={record._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex rounded-full w-10 h-10 items-center justify-center bg-green-100">
                          <span className="text-sm font-bold text-green-600">✓</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.employeeId.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {record.employeeId.employeeId}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="px-2 py-1 rounded-full font-semibold text-xs text-green-600 bg-green-50">
                          Present
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No employees marked as present for this date.</p>
              )}
            </div>

            {/* Absent Employees */}
            <div>
              <h4 className="text-lg font-semibold text-red-600 mb-4">Absent Employees ({absentEmployees.length})</h4>
              {absentEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {absentEmployees.map((record) => (
                    <div key={record._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex rounded-full w-10 h-10 items-center justify-center bg-red-100">
                          <span className="text-sm font-bold text-red-600">✗</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.employeeId.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {record.employeeId.employeeId}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="px-2 py-1 rounded-full font-semibold text-xs text-red-600 bg-red-50">
                          Absent
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No employees marked as absent for this date.</p>
              )}
            </div>

            {/* Unmarked Employees */}
            <div>
              <h4 className="text-lg font-semibold text-gray-600 mb-4">Not Marked ({unmarkedEmployees.length})</h4>
              {unmarkedEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unmarkedEmployees.map((emp) => (
                    <div key={emp._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex rounded-full w-10 h-10 items-center justify-center bg-gray-100">
                          <span className="text-sm font-bold text-gray-600">?</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {emp.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {emp.employeeId}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="px-2 py-1 rounded-full font-semibold text-xs text-gray-600 bg-gray-50">
                          Not Marked
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">All employees have been marked for this date.</p>
              )}
            </div>
          </>
        ) : (
          // For non-admin users, show their own attendance records filtered by date
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Attendance Records</h4>
            {filteredAttendance.length > 0 ? (
              <div className="space-y-4">
                {filteredAttendance.map((record) => (
                  <div key={record._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex rounded-full w-10 h-10 items-center justify-center ${record.status === 'Present' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <span className={`text-sm font-bold ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                            {record.status === 'Present' ? '✓' : '✗'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            Recorded: {new Date(record.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-semibold text-xs ${record.status === 'Present' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No attendance records for this date.</p>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default Attendance;