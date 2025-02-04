import { useSession } from "next-auth/react";
import { Loading } from "@/components/Loading";
import { AccessDenied } from "@/components/AccessDenied";

// Créer un composant de garde d'authentification
export function AuthGuard({ children, requiredRole }) {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <Loading />;
  }
  
  if (!session || (requiredRole && session.user.role !== requiredRole)) {
    return <AccessDenied />;
  }
  
  return children;
} 