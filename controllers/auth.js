const SuperAdmin = require('../models/super-admin');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const baseURL = 'http://localhost:3001/api';
const urlPosition = '/positions';
const urlEmployees = '/employees'

exports.postSuperAdminLogin = (req, res, next) => {
  // get the data of the user
  const email = req.body.email;
  const password = req.body.password;
  let user;

  SuperAdmin
    .findAll({ where: { email: email } })
    .then(results => {
      if (!results[0]) {
        throw 'No user found!';
      }
      user = results[0];
      return bcrypt.compare(password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Error in authentication!'
        })
      }
      const token = jwt.sign(
        { email: user.email, userId: user.id },
        'key',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        role: 'SuperAdmin',
        departmentId: null,
        positionsId: null,
        employeesId: null
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    })
}

exports.postAdminLogin = (req, res, next) => {
  // get the data of the user
  const email = req.body.email;
  const password = req.body.password;
  let user;
  let token;

  Admin
    .findAll({ where: { email: email } })
    .then(results => {
      if (!results[0]) {
        throw 'No user found!';
      }
      user = results[0];
      return bcrypt.compare(password, user.password);
    })
    .then(async result => {
      if (!result) {
        return res.status(401).json({
          message: 'Error in authentication!'
        })
      }
      token = jwt.sign(
        { email: user.email, userId: user.id, department: user.departmentId },
        'key',
        { expiresIn: '1h' }
      );

      // get all the job position of the department
      try {
        const responseFromPositions = await axios.request({
          baseURL,
          url: urlPosition + '/' + user.departmentId,
          method: 'get'
        });
        const positions = responseFromPositions.data.positions;
        const positionsId = [];
        positions.forEach(position => {
          const id = position.id;
          positionsId.push(id);
        });

        const responseFromEmployees = await axios.request({
          baseURL,
          url: urlEmployees + '/' + user.departmentId,
          method: 'get'
        });
        const employees = responseFromEmployees.data.employees;
        const idEmployees = [];
        employees.forEach(employee => {
          const id = employee.id;
          idEmployees.push(id);
        })

        res.status(200).json({
          token: token,
          expiresIn: 3600,
          role: 'admin',
          departmentId: user.departmentId,
          positionsId: positionsId,
          employeesId: idEmployees
        });

      } catch (err) {
        throw err;
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    })
}

exports.postCreateAdmin = (req, res, next) => {
  // get admin data
  const adminName = req.body.name;
  const adminSurname = req.body.surname;
  const adminEmail = req.body.email;
  const adminPassword = req.body.password;
  const adminDepartment = req.body.departmentId;

  bcrypt.hash(adminPassword, 10)
    .then(hash => {
      return Admin.create({
        name: adminName,
        surname: adminSurname,
        email: adminEmail,
        password: hash,
        departmentId: adminDepartment
      })
    })
    .then(user => {
      const token = jwt.sign(
        { email: user.email, userId: user.id, department: user.departmentId },
        'key',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error from server!'
      })
    })
}

exports.postEditAdmin = async (req, res, next) => {
  try {
    // get all the updated data of the admin from
    // request body
    const reqBody = req.body;
    const id = +reqBody.id;
    const updatedName = reqBody.name;
    const updatedSurname = reqBody.surname;
    const updatedEmail = reqBody.email;
    const updatedPassword = reqBody.password;
    const updatedDepartment = reqBody.departmentId;

    // get the admin from the server
    // using the id
    const admin = await Admin.findByPk(id);
    console.log(admin);
    admin.name = updatedName;
    admin.surname = updatedSurname;
    admin.email = updatedEmail;
    admin.departmentId = updatedDepartment;
    if (updatedPassword) {
      const hash = await bcrypt.hash(updatedPassword, 10)
      admin.password = hash;
    }

    // save the changes in the server
    const response = await admin.save();

    // send succeed response
    res.status(200).json({
      message: "The admin department was updated successfully!"
    })
  } catch (err) {
    res.status(500).json({
      message: "Error from the server in changing admins data!"
    })
  }

}

exports.getAdmins = async (req, res, next) => {
  try{

    // get the admin id from
    // the req parameters
    const departmentId = +req.params.departmentId;

    //get the admin from the server
    const admins = await Admin.findAll({ where: { departmentId } });
    // format the admin data so we don't pass the password
    // in the fronted and not needed information
    const changedAdmins = admins.map( admin => {
      admin.password = null;
      return admin;
    })

    // send the admin data to the server
    res.status(200).json({
      message: "Admin found successfully!",
      admins: changedAdmins
    })

  } catch(err) {
    res.status(500).json({
      message: "Error from the server!"
    })
  }
}

exports.getAdmin = async (req, res, next) => {
  try{
    // get the admin id from the
    // request parameters
    const id = +req.params.adminId;

    // get the admin from the database
    const admin = await Admin.findByPk(id);
    admin.password = null;

    res.status(200).json({
      message: "The admin was retrieved successfully!",
      admin
    });
  } catch(err) {
    res.status(500).json({
      message: "Error from the server!"
    })
  }
}

exports.deleteAdmin = async (req, res, next) => {
  try{
    // get the id of the admin from the
    // request parameters
    const id = req.params.adminId;

    // get the admin from the database
    const admin = await Admin.findByPk(id);

    // remove the admin from the database
    const result = admin.destroy()

    // send message to the front end
    res.status(200).json({
      message: "Admin deleted successfully!"
    })
  } catch(err) {
    res.status(500).json({
      message: "Error from server in deleting the admin!"
    })
  }
}

