const express = require('express');

const checkAuth = require('../middleware/check-auth');
const checkAuthorizedForPosition = require('../middleware/check-authorized-for-position');
const positionControllers = require('../controllers/position');

const router = express();

// /positions => POST
router.post('/:positionId', checkAuth, checkAuthorizedForPosition, positionControllers.updatePosition);
// /positions => POST
router.post('', checkAuth, checkAuthorizedForPosition, positionControllers.postPosition);
// /positions => GET
router.get('/edit/:positionId', checkAuth, positionControllers.getPosition);
// /positions => GET
router.get('/:departmentId', positionControllers.getPositions);
// /positions => DELETE
router.delete('/:positionId', checkAuth, positionControllers.deletePosition);

module.exports = router;
