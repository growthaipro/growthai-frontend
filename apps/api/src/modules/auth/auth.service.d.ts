import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(email: string, name: string, password: string, orgName: string): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: string;
            organizationId: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: string;
            organizationId: string;
        };
    }>;
    validateUser(email: string, password: string): Promise<any>;
    private generateTokens;
}
