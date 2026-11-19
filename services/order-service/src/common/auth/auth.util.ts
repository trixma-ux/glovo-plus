import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/** Utilisateur extrait du JWT émis par user-service (payload { sub, email, role }). */
export interface AuthUser { userId: string; email?: string; role: string }
export const ADMIN = 'ADMIN';
export const LIVREUR = 'LIVREUR';

/** Secret JWT partagé avec user-service ; obligatoire en production. */
export function jwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET doit être défini en production');
  return 'glovo-dev-only-jwt-secret';
}

/** Appel interne entre services (en-tête x-internal-token = INTERNAL_SERVICE_TOKEN). */
export function isInternalCall(req: any): boolean {
  const t = process.env.INTERNAL_SERVICE_TOKEN;
  return !!t && req?.headers?.['x-internal-token'] === t;
}

/** Utilisateur du JWT Bearer s'il est présent (401 si jeton invalide), sinon null. */
export function optionalUser(req: any): AuthUser | null {
  const h: string | undefined = req?.headers?.authorization;
  if (!h || !h.startsWith('Bearer ')) return null;
  try {
    const p: any = jwt.verify(h.slice(7), jwtSecret());
    return { userId: p.sub, email: p.email, role: p.role };
  } catch {
    throw new UnauthorizedException('Jeton invalide ou expiré');
  }
}

export function requireUser(req: any): AuthUser {
  const u = optionalUser(req);
  if (!u) throw new UnauthorizedException('Authentification requise');
  return u;
}

export function requireRole(req: any, ...roles: string[]): AuthUser {
  const u = requireUser(req);
  if (!roles.includes(u.role)) throw new ForbiddenException('Accès refusé');
  return u;
}
