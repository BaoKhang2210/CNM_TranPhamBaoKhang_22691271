const authService = require('../services/authService');

class AuthController {
    getLoginPage(req, res) {
        res.render('login', { error: null });
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await authService.login(username, password);

            if (user) {
                // Set session
                req.session.user = {
                    userId: user.userId,
                    username: user.username,
                    role: user.role
                };
                return res.redirect('/products');
            } else {
                return res.render('login', { error: "Invalid credentials" });
            }
        } catch (error) {
            console.error(error);
            return res.render('login', { error: "An error occurred during login" });
        }
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/auth/login');
    }
}

module.exports = new AuthController();
