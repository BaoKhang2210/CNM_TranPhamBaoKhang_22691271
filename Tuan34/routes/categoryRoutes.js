const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');

// All category routes require Authentication and Admin role
router.use(isAuthenticated);
router.use(authorize('admin'));

router.get('/', categoryController.list);
router.get('/create', categoryController.getCreatePage);
router.post('/create', categoryController.create);
router.post('/delete/:id', categoryController.delete); // Using POST for delete form submission

module.exports = router;
