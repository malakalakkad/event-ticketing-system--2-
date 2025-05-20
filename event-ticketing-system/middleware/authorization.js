module.exports = {
  authorizeRole: (...allowedRoles) => {
    return (req, res, next) => {
      const user = req.user;

      if (!user || !user.role) {
        return res.status(403).json({ message: 'Access denied: No role found' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied: You do not have permission' });
      }

      next();
    };
  },

  isOrganizer: (req, res, next) => {
    if (req.user?.role === 'organizer') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied: Organizer only' });
  },

  isAdmin: (req, res, next) => {
    if (req.user?.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

  
  