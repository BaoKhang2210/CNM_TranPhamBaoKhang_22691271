const categoryRepo = require('../repositories/categoryRepo');
const productRepo = require('../repositories/productRepo');

class CategoryService {
    async getAllCategories() {
        const result = await categoryRepo.getAll();
        return result.Items || [];
    }

    async createCategory(categoryData) {
        return await categoryRepo.create(categoryData);
    }

    async deleteCategory(categoryId) {
        // Validation: Check if products exist in this category?
        // Requirement says: "When deleting a category, DO NOT delete the products inside it." 
        // So we strictly just delete the category. 
        // Note: Products will have a dangling categoryId. This allows them to exist but they might need re-categorization.

        await categoryRepo.delete(categoryId);
    }

    async getCategoryById(id) {
        return await categoryRepo.getById(id);
    }
}

module.exports = new CategoryService();
