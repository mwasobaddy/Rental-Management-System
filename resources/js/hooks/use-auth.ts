import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function useAuth() {
    const { auth } = usePage<SharedData>().props;
    return auth;
}

export function useUser() {
    const { user } = useAuth();
    return user;
}

export function useRoles() {
    const user = useUser();
    return user?.roles || [];
}

export function usePermissions() {
    const user = useUser();
    return user?.permissions || [];
}

export function useHasRole(role: string) {
    const roles = useRoles();
    return roles.includes(role);
}

export function useHasPermission(permission: string) {
    const permissions = usePermissions();
    return permissions.includes(permission);
}

export function useHasAnyRole(roles: string[]) {
    const userRoles = useRoles();
    return roles.some(role => userRoles.includes(role));
}

export function useHasAnyPermission(permissions: string[]) {
    const userPermissions = usePermissions();
    return permissions.some(permission => userPermissions.includes(permission));
}

export function useHasAllRoles(roles: string[]) {
    const userRoles = useRoles();
    return roles.every(role => userRoles.includes(role));
}

export function useHasAllPermissions(permissions: string[]) {
    const userPermissions = usePermissions();
    return permissions.every(permission => userPermissions.includes(permission));
}