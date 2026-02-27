import { AuthService } from './auth.service';
declare class RegisterDto {
    email: string;
    name: string;
    password: string;
    organizationName: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: string;
            organizationId: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: string;
            organizationId: string;
        };
    }>;
}
export {};
