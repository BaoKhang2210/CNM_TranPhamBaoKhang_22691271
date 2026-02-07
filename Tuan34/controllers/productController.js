const productService = require('../services/productService');
const categoryService = require('../services/categoryService');

class ProductController {
    async list(req, res) {
        try {
            const filters = {
                categoryId: req.query.category,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                search: req.query.search
            };

            const products = await productService.getAllProducts(filters);
            const categories = await categoryService.getAllCategories();

            res.render('products/list', {
                products,
                categories,
                filters,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    async getCreatePage(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.render('products/form', {
                product: null,
                categories,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    async create(req, res) {
        try {
            const userId = req.session.user.userId;
            await productService.createProduct(req.body, req.file, userId);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send("Error creating product");
        }
    }

    async getEditPage(req, res) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            const categories = await categoryService.getAllCategories();

            if (!product) return res.status(404).send("Product not found");

            res.render('products/form', {
                product,
                categories,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const userId = req.session.user.userId;

            await productService.updateProduct(id, req.body, req.file, userId);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send("Error updating product");
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.session.user.userId;

            await productService.deleteProduct(id, userId);
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            res.status(500).send("Error deleting product");
        }
    }
}

module.exports = new ProductController();
