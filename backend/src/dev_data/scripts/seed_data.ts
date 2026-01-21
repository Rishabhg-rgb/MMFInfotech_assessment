import mongoose from 'mongoose';
import 'dotenv/config';
import Seeds from './seed_data/index';
import Role from '../../models/role.model';
import Employee from '../../models/employee.model';
import Env from '../../constant/env';

mongoose
  .connect(Env.DATABASE_URL as string, { autoIndex: true })
  .then(async () => await seedData())
  .catch((err) => console.log(err));

const seedData = async () => {
  try {
    // Clear Old Data
    await Role.deleteMany({ _id: { $in: Seeds.ids.roles } });
    await Employee.deleteMany({ _id: { $in: Seeds.ids.employees } });
    console.log('Old Data Deleted');

    // Seed Data
    await Role.create(Seeds.roles);
    await Employee.create(Seeds.employees);
    console.log('Data Seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};