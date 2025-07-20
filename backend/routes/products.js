const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const ctrl = require('../controllers/productController');
const auth      = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const validate = (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(422).json({ errors: errs.array() });
    next();
};

router.get('/',   ctrl.getAll);
router.get('/:id', ctrl.getOne);

router.post(
       '/', auth, authorize('admin'),
        body('name').notEmpty(),
        body('price').isDecimal(),
        body('stock').isInt({ min: 0 }),
        body('categoryId').isInt(),
        body('imageName').isString().optional(),
        validate, ctrl.create
    );


router.put(
       '/:id', auth, authorize('admin'),
        body('price').optional().isDecimal(),
        body('stock').optional().isInt({ min: 0 }),
        body('imageName').isString().optional(),
        validate, ctrl.update
    );

router.delete(
       '/:id', auth, authorize('admin'),
       ctrl.remove
    );


module.exports = router;
