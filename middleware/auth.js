// Middleware pour vérifier si l'utilisateur est authentifié
export const ensureAuthenticated = (req, res, next) => {
  console.log('Authentification status:', req.isAuthenticated()); 
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Vous devez être authentifié pour créer une liste.' });
};
