const SuperAdmin = require('../models/super-admin');
const Employee = require('../models/employee');

module.exports = async (req, res, next) => {
  try{
    // get the id of the super admin
    const idAdmin = req.userData.userId;
    let superAdmin;
    const adminDepartmentId = req.userData.department;
    // in case a department is being edited
    const employeeDepartmentId = req.body.departmentId;

    if (idAdmin) {superAdmin = await SuperAdmin.findByPk(idAdmin);}
    if (superAdmin) { return next() }
    else if (employeeDepartmentId) {
      const employeeId = req.params.employeeID;
      const employee = await Employee.findByPk(employeeId);
      if (adminDepartmentId === employee.departmentId) { return next() }
    }
    throw err;
  }
  catch(err) {
    res.status(401).json({ message: 'You are not authorized!'});
  }
}
