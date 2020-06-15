const express = require('express');

const checkAuth = require('../middleware/check-auth');
const checkSuperAdmin = require('../middleware/check-super-auth');
const checkAuthorizedForDepartment = require('../middleware/check-authorized-for-department');


const departmentControllers = require('../controllers/department');

const router = express();

// /departments => UPDATE
router.post('/:id', checkAuth, checkAuthorizedForDepartment, departmentControllers.updateDepartment);
// /departments => POST
router.post('', checkAuth, checkSuperAdmin, departmentControllers.postDepartment);
// /departments => GET by id
router.get('/:id', departmentControllers.getDepartment);
// /departments => GET
router.get('', departmentControllers.getDepartments);
// /departments/:id => DELETE
router.delete('/:id', checkAuth, checkSuperAdmin, departmentControllers.deleteDepartment);

module.exports = router;
