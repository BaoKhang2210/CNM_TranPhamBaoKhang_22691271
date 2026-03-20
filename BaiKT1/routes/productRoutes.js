const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const upload = require('../middleware/upload');

router.get('/', controller.index);

router.get('/create', controller.createForm);
router.post('/create', upload.single('image'), controller.create);

router.get('/detail/:id', controller.detail);

router.get('/edit/:id', controller.editForm);
router.post('/edit/:id', upload.single('image'), controller.update);

router.get('/delete/:id', controller.delete);

module.exports = router;