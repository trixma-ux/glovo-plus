import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Anti-brute-force limité aux points d'entrée d'authentification (POST /api/auth/login,
 * POST /api/users = inscription). Les autres routes ne sont pas limitées par la gateway.
 * Clé = IP réelle du client : en-tête cf-connecting-ip posé par Cloudflare devant Render
 * (non falsifiable par le client), sinon req.ip (trust proxy activé dans main.ts).
 */
@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.method !== 'POST') return true;
    const p = String(req.path || '').replace(/\/+$/, '');
    return !(p === '/api/auth/login' || p === '/api/users');
  }
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const cf = req.headers?.['cf-connecting-ip'];
    return String(Array.isArray(cf) ? cf[0] : cf || req.ip || 'unknown');
  }
}
