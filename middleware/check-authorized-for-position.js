const SuperAdmin = require('../models/super-admin');

module.exports = async (req, res, next) => {
  try{
    // get the id of the super admin
    const idAdmin = req.userData.userId;
    let superAdmin;
    const adminDepartmentId = req.userData.department;
    // in case a department is being edited
    const positionDepartmentId = +req.body.departmentId;

    if(idAdmin) {superAdmin = await SuperAdmin.findByPk(idAdmin);}
    if (superAdmin) { return next() }
    if (positionDepartmentId === adminDepartmentId) { return next() }
    throw err;
  }
  catch(err) {
    res.status(401).json({ message: 'You are not authorized!'});
  }
}
