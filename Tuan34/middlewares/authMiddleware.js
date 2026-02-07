const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    // If not authenticated, redirect to login
    res.redirect('/auth/login');
};

const authorize = (role) => {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role === role) {
            return next();
        }
        // Forbidden or Unauthorized
        res.status(403).render('error', { message: "Access Denied: You do not have permission to view this resource." });
    };
};

module.exports = {
    isAuthenticated,
    authorize
};
