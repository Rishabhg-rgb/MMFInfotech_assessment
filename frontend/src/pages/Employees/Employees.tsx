import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getEmployees, createEmployee, deleteEmployee } from '../../apis';
import { setLoading, setEmployees, addEmployee, removeEmployee } from '../../redux/slice/employeeSlice';
import type { RootState } from '../../redux/store/store';
import { Button, Input, Select, Modal, Loader, Pagination } from '../../components';
import toast from 'react-hot-toast';

const Employees: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    department: '',
    password: '',
    passwordConfirm: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: employees, loading, pagination } = useSelector((state: RootState) => state.employee);
  const { employee: currentUser } = useSelector((state: RootState) => state.auth);

  const isAdmin = currentUser?.roleId?.name === 'Admin';

  useEffect(() => {
    fetchEmployees();
  }, [searchParams]);

  const fetchEmployees = async () => {
    dispatch(setLoading(true));
    try {
      const page = searchParams.get('page') || '1';
      const response = await getEmployees({ page,limit: 10 });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createEmployee(formData);
      dispatch(addEmployee(response.data.data));
      setShowModal(false);
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        department: '',
        password: '',
        passwordConfirm: '',
      });
      toast.success('Employee created successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await deleteEmployee(id);
      dispatch(removeEmployee(id));
      toast.success('Employee deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete employee');
    }
  };

  const departmentOptions = [
    { value: '', label: 'Select' },
    { value: 'IT', label: 'IT' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            All Employees
          </h3>
          <p className="text-gray-600 mt-2">
            Manage your team members and their information.
          </p>
        </div>
        {isAdmin && (
          <div className="mt-3 bg-gray-100! md:mt-0">
            <Modal
              button={
                <Button className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm">
                  Add Employee
                </Button>
              }
              isOpen={showModal}
              toggleModal={() => setShowModal(!showModal)}
              crossIcon
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Employee</h2>
                </div>
                <Input
                  label="Employee ID"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                />
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Select
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  options={departmentOptions}
                  required
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Input
                  label="Confirm Password"
                  name="passwordConfirm"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  required
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
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Employee
                  </Button>
                </div>
              </form>
            </Modal>
          </div>
        )}
      </div>
      <div className="mt-12 relative h-max overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 w-full">
            <tr className="text-gray-600 text-xs w-full font-medium">
              <th className="py-3 pl-6">Employee</th>
              <th className="py-3">Department</th>
              <th className="py-3">Employee ID</th>
              {isAdmin && <th className="py-3"></th>}
            </tr>
          </thead>
          <tbody className="bg-white w-full h-full">
            {employees.map((employee) => (
              <tr key={employee._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="pl-6 py-4 flex items-center gap-3">
                  <div className="flex rounded-full overflow-hidden w-10 h-10 items-center justify-center">
                    <div className="flex rounded-full w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 text-white border border-white overflow-hidden items-center justify-center">
                      <span className="text-sm font-bold">
                        {employee.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {employee.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employee.email}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="px-3 py-1 rounded-full font-semibold text-xs text-green-600 bg-green-50">
                    {employee.department}
                  </span>
                </td>
                <td className="py-4">{employee.employeeId}</td>
                {isAdmin && (
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => navigate(`/employees/${employee._id}`)}
                        size="sm"
                        className="py-1.5 px-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                      >
                        View
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(employee._id)}
                        className="py-1.5 px-3 text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">👥</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
            <p className="text-gray-500">Get started by adding your first team member</p>
          </div>
        )}
      </div>
      <Pagination totalPages={pagination.totalPages} />
    </div>
  );
};

export default Employees;