const express = require('express');

const checkAuth = require('../middleware/check-auth');
const checkSuperAdmin = require('../middleware/check-super-auth');
const authControllers = require('../controllers/auth');

const router = express();

// /auth => POST
router.post('/super-admin', authControllers.postSuperAdminLogin);
// /auth/create-user => POST
router.post('/create-user', checkAuth, checkSuperAdmin, authControllers.postCreateAdmin);
// /auth/users => GET
router.get('/users/:departmentId',  authControllers.getAdmins);
// /auth/user => GET
router.get('/user/:adminId',  authControllers.getAdmin);
// /auth/edit-user => GET
router.post('/edit-user', checkAuth, checkSuperAdmin, authControllers.postEditAdmin);
// /auth/delete-user => DELETE
router.delete('/user/:adminId',checkAuth, checkSuperAdmin, authControllers.deleteAdmin);
// /auth => POST
router.post('', authControllers.postAdminLogin);

module.exports = router;
