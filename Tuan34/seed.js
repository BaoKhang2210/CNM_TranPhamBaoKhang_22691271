require('dotenv').config();
const authService = require('./services/authService');

async function seed() {
    try {
        console.log("Seeding Admin User...");
        // Username: admin, Password: admin123
        await authService.register('admin', 'admin123', 'admin');
        console.log("Admin user created successfully.");
    } catch (error) {
        if (error.message === "User already exists") {
            console.log("Admin user already exists.");
        } else {
            console.error("Error seeding admin:", error);
        }
    }

    try {
        console.log("Seeding Staff User...");
        // Username: staff, Password: staff123
        await authService.register('staff', 'staff123', 'staff');
        console.log("Staff user created successfully.");
    } catch (error) {
        if (error.message === "User already exists") {
            console.log("Staff user already exists.");
        } else {
            console.error("Error seeding staff:", error);
        }
    }
}

seed();
