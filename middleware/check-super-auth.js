const SuperAdmin = require('../models/super-admin');

module.exports = async (req, res, next) => {
  try{
    // get the id of the super admin
    const id = req.userData.userId;
    const superAdmin = await SuperAdmin.findByPk(id);
    if (superAdmin) { next() }
    else throw err;
  }
  catch(err) {
    res.status(401).json({ message: 'You are not authenticated!'});
  }
}
