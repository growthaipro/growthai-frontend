import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

export interface TenantContext {
  userId: string;
  organizationId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return next(); // Let guards handle unauthenticated routes
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token);

      req.tenant = {
        userId: payload.sub,
        organizationId: payload.organizationId,
        role: payload.role,
      };
    } catch {
      // Expired/invalid token — guards will reject it properly
    }

    next();
  }
}
