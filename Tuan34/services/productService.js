const productRepo = require('../repositories/productRepo');
const logRepo = require('../repositories/logRepo');
const s3Service = require('./s3Service');

class ProductService {
    async getAllProducts(filters = {}) {
        // Fetch all
        const result = await productRepo.getAll();
        let products = result.Items || [];

        // Filter: Soft Delete (Exclude isDeleted = true)
        products = products.filter(p => !p.isDeleted);

        // Filter: Category
        if (filters.categoryId) {
            products = products.filter(p => p.categoryId === filters.categoryId);
        }

        // Filter: Price Range (min, max)
        if (filters.minPrice) {
            products = products.filter(p => p.price >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            products = products.filter(p => p.price <= parseFloat(filters.maxPrice));
        }

        // Search: Name (contains, case-insensitive)
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            products = products.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        // Add Low Stock Warning Flag (though simpler to do in View, service can enrich data)
        products = products.map(p => ({
            ...p,
            isLowStock: p.quantity < 5
        }));

        return products;
    }

    async getProductById(id) {
        const result = await productRepo.getById(id);
        return result.Item;
    }

    async createProduct(productData, file, userId) {
        // 1. Upload Image
        let imageUrl = "";
        if (file) {
            imageUrl = await s3Service.uploadFile(file);
        }

        // 2. Prepare Data
        const newProduct = {
            ...productData,
            price: Number(productData.price),
            quantity: Number(productData.quantity),
            url_image: imageUrl
        };

        // 3. Save to DB
        const createdProduct = await productRepo.create(newProduct);

        // 4. Audit Log
        await logRepo.createLog(createdProduct.id, 'CREATE', userId);

        return createdProduct;
    }

    async updateProduct(id, productData, file, userId) {
        const currentProduct = await this.getProductById(id);
        if (!currentProduct) throw new Error("Product not found");

        const updates = { ...productData };
        // Ensure numbers
        if (updates.price) updates.price = Number(updates.price);
        if (updates.quantity) updates.quantity = Number(updates.quantity);

        // Handle Image Update
        if (file) {
            // Optional: Delete old image
            if (currentProduct.url_image) {
                await s3Service.deleteFile(currentProduct.url_image);
            }
            updates.url_image = await s3Service.uploadFile(file);
        }

        // Update DB
        const result = await productRepo.update(id, updates);

        // Audit Log
        await logRepo.createLog(id, 'UPDATE', userId);

        return result;
    }

    async deleteProduct(id, userId) {
        const currentProduct = await this.getProductById(id);
        if (!currentProduct) throw new Error("Product not found");

        // Soft Delete
        await productRepo.delete(id);

        // Audit Log
        await logRepo.createLog(id, 'DELETE', userId);
    }
}

module.exports = new ProductService();
