import mongoose from 'mongoose';

export default [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    name: 'Admin',
    permissions: [{ resource: '*', actions: ['*'] }],
    isDeleted: false,
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    name: 'Employee',
    permissions: [{ resource: 'attendance', actions: ['read'] }],
    isDeleted: false,
  },
];