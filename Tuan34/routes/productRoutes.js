const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public or Authenticated? Requirements say "Staff: Read-only access".
// So List is accessible to Staff (and Admin).
// "isAuthenticated" middleware checks if logged in.
router.use(isAuthenticated);

// Read (List) - Accessible by Admin and Staff
router.get('/', productController.list);

// Create, Update, Delete - Accessible by ADMIN only
router.get('/create', authorize('admin'), productController.getCreatePage);
router.post('/create', authorize('admin'), upload.single('image'), productController.create);

router.get('/edit/:id', authorize('admin'), productController.getEditPage);
router.post('/edit/:id', authorize('admin'), upload.single('image'), productController.update);

router.post('/delete/:id', authorize('admin'), productController.delete);

module.exports = router;
