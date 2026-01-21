import mongoose, { Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  roleId: mongoose.Types.ObjectId;
  password?: string;
  passwordChangedAt?: Date;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  correctPassword(hash: string, userPass: string): Promise<boolean>;
  changedPasswordAfter(jwtTimestamp: number): boolean;
}

const employeeSchema = new mongoose.Schema<IEmployee>(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return validator.isEmail(value);
        },
        message: 'Please provide a valid email',
      },
    },
    department: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    password: { type: String, required: true, select: false },
    passwordChangedAt: { type: Date, select: false },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
employeeSchema.index({ email: 1 });
employeeSchema.index({ employeeId: 1 });

// Pre-save middleware for password hashing
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password!, 12);
  next();
});

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date();
  next();
});

// Pre-find middleware for population
employeeSchema.pre('find', async function (next) {
  const shouldSkip = this.getOptions().skipRolePopulate ?? false;

  if (!shouldSkip) {
    this.populate('roleId', '_id name permissions');
  }

  next();
});

employeeSchema.pre('findOne', async function (next) {
  const shouldSkip = this.getOptions().skipRolePopulate ?? false;

  if (!shouldSkip) {
    this.populate('roleId', '_id name permissions');
  }

  next();
});

employeeSchema.pre('findOneAndUpdate', async function (next) {
  const shouldSkip = this.getOptions().skipRolePopulate ?? false;

  if (!shouldSkip) {
    this.populate('roleId', '_id name permissions');
  }

  next();
});

// Instance methods
employeeSchema.methods.correctPassword = async function (hash: string, userPass: string) {
  return await bcrypt.compare(userPass, hash);
};

employeeSchema.methods.changedPasswordAfter = function (jwtTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

export default mongoose.model<IEmployee>('Employee', employeeSchema);