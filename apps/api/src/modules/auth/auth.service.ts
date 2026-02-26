import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, name: string, password: string, orgName: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);

    // Create org + user + membership in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: orgName,
          slug: orgName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        },
      });

      const user = await tx.user.create({
        data: { email, name, passwordHash },
      });

      await tx.organizationMember.create({
        data: { userId: user.id, organizationId: org.id, role: 'ORG_ADMIN' },
      });

      return { user, org };
    });

    return this.generateTokens(result.user, result.org.id, 'ORG_ADMIN');
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { memberships: { include: { organization: true } } },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) throw new UnauthorizedException('Account deactivated');

    const membership = user.memberships[0];
    if (!membership) throw new UnauthorizedException('No organization found');

    return this.generateTokens(user, membership.organizationId, membership.role);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  private generateTokens(user: any, organizationId: string, role: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      organizationId,
      role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
        organizationId,
      },
    };
  }
}
