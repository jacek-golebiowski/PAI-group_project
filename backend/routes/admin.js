const router      = require('express').Router();
const auth        = require('../middleware/auth');
const authorize   = require('../middleware/authorize');
const adminCtrl   = require('../controllers/adminController');

// dostęp tylko dla admina
router.use(auth, authorize('admin'));

router.get('/rentals', adminCtrl.getAllRentals);

// CRUD produktów
router.get('/products',     adminCtrl.listProducts);
router.post('/products',    adminCtrl.createProduct);
router.put('/products/:id', adminCtrl.updateProduct);
router.delete('/products/:id', adminCtrl.deleteProduct);

module.exports = router;
