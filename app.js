const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');

const sequelize = require('./util/database');

const app = express();

// routers
const departmentRouters = require('./routers/department');
const positionRouters = require('./routers/position');
const employeeRouters = require('./routers/employee');
const authRouters = require('./routers/auth');

// schemas
const SuperAdmin = require('./models/super-admin');
const Department = require('./models/department');
const Position = require('./models/job-position');
const Employee = require('./models/employee');
const EmployeePosition = require('./models/employee-position');
const Admin = require('./models/admin');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join('./uploads')));

// setting the header for the router and the allowed access
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTION'
  );
  next();
});

// setting the path for the router
app.use('/api/departments', departmentRouters);
app.use('/api/positions', positionRouters);
app.use('/api/employees', employeeRouters);
app.use('/api/auth', authRouters);

// associations between schemas for the sequelize
Department.hasMany(Employee);
Department.hasOne(Admin);
Department.hasMany(Position);
Position.belongsTo(Department);
Position.hasMany(EmployeePosition);
Employee.hasMany(EmployeePosition);

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    return SuperAdmin.findByPk(1)
  })
  .then(superAdmin => {
    if (!superAdmin) {

      return bcrypt.hash('Grei221998', 10)
        .then(hash => {
          return SuperAdmin.create({
            name: 'Grei',
            surname: 'Muka',
            email: 'grei@test.com',
            password: hash
          });
        })
    }
    return Promise.resolve(superAdmin);
  })
  .then(superAdmin => {
    if (process.env.PORT) {
      app.listen(process.env.PORT);
    }
    else {app.listen(3000);}
  })
  .catch(err => console.log(err));

module.exports = app;
