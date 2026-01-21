import mongoose, { Document } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent';
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new mongoose.Schema<IAttendance>(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true },
  },
  { timestamps: true }
);

// Pre Middlewares for auto-population
attendanceSchema.pre('find', async function (next) {
  const shouldSkip = this.getOptions().skipEmployeePopulate ?? false;

  if (!shouldSkip) {
    this.populate('employeeId', '_id employeeId name department');
  }

  next();
});

attendanceSchema.pre('findOne', async function (next) {
  const shouldSkip = this.getOptions().skipEmployeePopulate ?? false;

  if (!shouldSkip) {
    this.populate('employeeId', '_id employeeId name department');
  }

  next();
});

attendanceSchema.pre('findOneAndUpdate', async function (next) {
  const shouldSkip = this.getOptions().skipEmployeePopulate ?? false;

  if (!shouldSkip) {
    this.populate('employeeId', '_id employeeId name department');
  }

  next();
});

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);