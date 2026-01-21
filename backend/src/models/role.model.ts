import mongoose, { ObjectId } from 'mongoose';

interface IPermission {
  resource: string;
  actions: string[];
}

export interface IRole extends mongoose.Document {
  name: string;
  permissions: IPermission[];
  isDeleted: Boolean;
  createdAt: Date;
}

export interface IRoleModel extends mongoose.Model<IRole> {
  getRoleIdsByNames(names: string[]): Promise<ObjectId[]>;
}

const roleSchema = new mongoose.Schema<IRole, IRoleModel>({
  name: {
    type: String,
    trim: true,
    index: true,
  },
  permissions: [
    {
      _id: false,
      resource: { type: String, required: true },
      actions: [
        {
          type: String,
          enum: ['*', 'read', 'write', 'update', 'delete', 'manage'],
          required: true,
        },
      ],
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

roleSchema.pre(/^find/, function (next) {
  const query = this as mongoose.Query<any, any>;
  query.select({ createdAt: 0, __v: 0 });
  next();
});

// Static method
roleSchema.statics.getRoleIdsByNames = async function (names: string[]): Promise<ObjectId[]> {
  const regexConditions = names.map((name) => ({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
  }));

  const roles = await this.find({ $or: regexConditions }, { _id: 1 });
  return roles.map((role: IRole) => role._id as ObjectId);
};

const Role = mongoose.model<IRole, IRoleModel>('Role', roleSchema);

export default Role;