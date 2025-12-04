import { ReactNode } from 'react';
import { useHasRole, useHasPermission, useHasAnyRole, useHasAnyPermission } from '@/hooks/use-auth';

interface CanProps {
    children: ReactNode;
    role?: string;
    permission?: string;
    roles?: string[];
    permissions?: string[];
    requireAll?: boolean;
    fallback?: ReactNode;
}

export default function Can({ 
    children, 
    role, 
    permission, 
    roles = [], 
    permissions = [], 
    requireAll = false,
    fallback = null 
}: CanProps) {
    const hasRole = useHasRole(role || '');
    const hasPermission = useHasPermission(permission || '');
    const hasAnyRole = useHasAnyRole(roles);
    const hasAnyPermission = useHasAnyPermission(permissions);

    let canAccess = false;

    // Check individual role
    if (role && hasRole) {
        canAccess = true;
    }

    // Check individual permission
    if (permission && hasPermission) {
        canAccess = true;
    }

    // Check multiple roles
    if (roles.length > 0) {
        canAccess = requireAll ? 
            roles.every(r => useHasRole(r)) : 
            hasAnyRole;
    }

    // Check multiple permissions
    if (permissions.length > 0) {
        canAccess = requireAll ? 
            permissions.every(p => useHasPermission(p)) : 
            hasAnyPermission;
    }

    // If no specific checks provided, deny access
    if (!role && !permission && roles.length === 0 && permissions.length === 0) {
        canAccess = false;
    }

    return canAccess ? <>{children}</> : <>{fallback}</>;
}