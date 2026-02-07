const categoryService = require('../services/categoryService');

class CategoryController {
    async list(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            // Assuming we will have a view for categories
            res.render('categories/list', {
                categories,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }

    getCreatePage(req, res) {
        res.render('categories/form', {
            category: null,
            user: req.session.user
        });
    }

    async create(req, res) {
        try {
            const { name, description } = req.body;
            await categoryService.createCategory({ name, description });
            res.redirect('/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send("Error creating category");
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await categoryService.deleteCategory(id);
            res.redirect('/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send("Error deleting category");
        }
    }
}

module.exports = new CategoryController();
