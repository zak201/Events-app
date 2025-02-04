// Middleware pour protéger les routes API
export function withAuth(handler, requiredRole) {
  return async function(req, res) {
    const session = await getServerSession(req);
    
    if (!session || (requiredRole && session.user.role !== requiredRole)) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    
    return handler(req, res);
  };
} 