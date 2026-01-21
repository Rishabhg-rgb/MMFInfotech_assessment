import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/store';
import {
  FaHome,
  FaUsers,
  FaClock,
  FaTimes
} from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { employee } = useSelector((state: RootState) => state.auth);
  const isAdmin = employee?.roleId?.name === 'Admin';

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FaHome },
    ...(isAdmin ? [{ name: 'Employees', href: '/employees', icon: FaUsers }] : []),
    { name: 'Attendance', href: '/attendance', icon: FaClock },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <h1 className="text-xl font-bold text-white">HRMS Lite</h1>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-white hover:bg-white hover:bg-opacity-20 lg:hidden"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {employee?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{employee?.name}</p>
                <p className="text-xs text-gray-500">{employee?.roleId?.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 transition-colors duration-200
                      ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2024 HRMS Lite
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;