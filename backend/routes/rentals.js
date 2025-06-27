const router = require('express').Router();
const ctrl = require('../controllers/rentalController');
const auth = require('../middleware/auth');

router.post('/', auth, ctrl.rent);
router.get('/', auth, ctrl.getUserRentals);
router.get('/history', auth, ctrl.getRentalHistory);

module.exports = router;