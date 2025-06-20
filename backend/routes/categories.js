const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const ctrl = require('../controllers/categoryController');

const validate = (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(422).json({ errors: errs.array() });
    next();
};

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getOne);

router.post(
    '/',
    body('name').notEmpty().withMessage('Nazwa jest wymagana'),
    body('description').optional(),
    validate,
    ctrl.create
);

router.put(
    '/:id',
    body('name').optional().notEmpty().withMessage('Nazwa nie może być pusta'),
    body('description').optional(),
    validate,
    ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;
