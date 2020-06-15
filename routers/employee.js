const express = require('express');
const extractFile = require('../middleware/file');

const checkAuth = require('../middleware/check-auth');
const checkAuthorizedForEmployee = require('../middleware/check-authorized-for-employee')
const employeeControllers = require('../controllers/employee');

const router = express();

// /employees/search-fired-employees => GET
router.get('/search-fired-employees/:searchTerm', employeeControllers.searchFiredEmployees);
// /employees/search-fired-employees => GET
router.get('/search-fired-employees', employeeControllers.searchFiredEmployees);
// /employees/search => GET
router.get('/search/:searchTerm', employeeControllers.searchEmployee);
// /employees/edit/ => GET
router.get('/edit/:employeeID', employeeControllers.getEmployee);
// /employees => POST
router.post('/edit', extractFile, employeeControllers.postEditEmployee);
// /employees => GET
router.get('/jobPosition/:employeeID', employeeControllers.getEmployeeJobPosition);
// /employees => GET
router.get('/:departmentId', employeeControllers.getEmployees);
// /employees => POST
router.post('', checkAuth,checkAuthorizedForEmployee, extractFile, employeeControllers.postEmployee);
// /employees/job-history => GET
router.get('/job-history/:employeeID', employeeControllers.getEmployeeJobHistory);
// /employees/fire-employee => GET
router.get('/fire-employee/:employeeID', checkAuth, checkAuthorizedForEmployee, employeeControllers.fireEmployee);



module.exports = router;
