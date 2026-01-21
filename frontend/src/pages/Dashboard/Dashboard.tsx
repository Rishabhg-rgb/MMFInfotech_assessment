import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarCheck, FaUser, FaPlus, FaEye } from 'react-icons/fa';
import type { RootState } from '../../redux/store/store';

const Dashboard: React.FC = () => {
  const { employee } = useSelector((state: RootState) => state.auth);

  const stats = [
    {
      title: 'Welcome back',
      value: employee?.name || 'User',
      icon: FaUser,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Employees',
      value: 'Manage Team',
      icon: FaUsers,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      link: '/employees',
    },
    {
      title: 'Attendance',
      value: 'Track Records',
      icon: FaCalendarCheck,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      link: '/attendance',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome to your HRMS dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;

              if (stat.link) {
                return (
                  <Link
                    key={index}
                    to={stat.link}
                    className="relative overflow-hidden cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <IconComponent className={`w-6 h-6 text-${stat.color.split('-')[1]}-600`} />
                        </div>
                      </div>
                      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} w-full`}></div>
                    </div>
                  </Link>
                );
              }

              return (
                <div
                  key={index}
                  className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <IconComponent className={`w-6 h-6 text-${stat.color.split('-')[1]}-600`} />
                      </div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} w-full`}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
              <p className="text-indigo-100 text-sm">Manage your HR tasks efficiently</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {employee?.roleId?.name === 'Admin' && (
                  <Link
                    to="/employees"
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Link>
                )}
                <Link
                  to="/attendance"
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FaCalendarCheck className="w-4 h-4 mr-2" />
                  Mark Attendance
                </Link>
                <Link
                  to="/employees"
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FaEye className="w-4 h-4 mr-2" />
                  View Employees
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;