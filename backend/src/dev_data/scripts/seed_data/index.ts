import Roles from './roles.seed';
import Employees from './employees.seed';

export default {
  roles: Roles,
  employees: Employees,
  ids: {
    roles: Roles.map((e) => e._id),
    employees: Employees.map((e) => e._id),
  },
};