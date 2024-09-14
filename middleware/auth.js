// Middleware pour vérifier si l'utilisateur est authentifié
export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Vous devez être authentifié pour ajouter un commentaire.' });
  };
  