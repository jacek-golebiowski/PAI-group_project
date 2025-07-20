const router = require('express').Router();
const ctrl   = require('../controllers/rentalController');
const auth   = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/',        auth, ctrl.rent);
router.get('/',         auth, ctrl.getUserRentals);
router.get(
       '/history',
       auth, authorize('admin'),
       ctrl.getRentalHistory
     );
router.patch('/:rentalId/return', auth, ctrl.returnItem);

module.exports = router;
