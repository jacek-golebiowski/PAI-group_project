const router = require('express').Router();
const ctrl   = require('../controllers/rentalController');
const auth   = require('../middleware/auth');

router.post('/',        auth, ctrl.rent);
router.get('/',         auth, ctrl.getUserRentals);
router.get('/history',  auth, ctrl.getRentalHistory);
router.patch('/:rentalId/return', auth, ctrl.returnItem);

module.exports = router;
