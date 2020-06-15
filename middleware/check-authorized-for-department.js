const SuperAdmin = require('../models/super-admin');

module.exports = async (req, res, next) => {
  try{
    // get the id of the super admin
    const idAdmin = req.userData.userId;
    const adminDepartmentId = req.userData.department;
    let superAdmin;
    // in case a department is being edited
    const departmentToBeEditedId = +req.body.id;

    if (idAdmin) { superAdmin = await SuperAdmin.findByPk(idAdmin); }
    if (superAdmin) { return next() }
    if (departmentToBeEditedId === adminDepartmentId) { return next() };
    throw err;

  }
  catch(err) {
    res.status(401).json({ message: 'You are not authorized!'});
  }
}
