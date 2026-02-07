const bcrypt = require('bcryptjs');
const userRepo = require('../repositories/userRepo');

class AuthService {
    async login(username, password) {
        const user = await userRepo.findByUsername(username);
        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        return user;
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    // Helper to create an admin if not exists (for setup)
    async register(username, password, role = 'staff') {
        const existing = await userRepo.findByUsername(username);
        if (existing) throw new Error("User already exists");

        const hashedPassword = await this.hashPassword(password);
        return await userRepo.create({
            username,
            password: hashedPassword,
            role
        });
    }
}

module.exports = new AuthService();
