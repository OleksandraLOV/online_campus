import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    login(login: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            studentProfile: import("../common/types/entities").StudentProfile | undefined;
            teacherProfile: import("../common/types/entities").TeacherProfile | undefined;
            id: string;
            login: string;
            role: import("../common/types/roles.enum").Role;
            email: string;
            phone?: string;
            firstName: string;
            lastName: string;
            middleName?: string;
            avatarUrl?: string;
            status: "active" | "blocked";
            createdAt: string;
        };
    }>;
    getProfile(userId: string): Promise<{
        studentProfile: import("../common/types/entities").StudentProfile | undefined;
        teacherProfile: import("../common/types/entities").TeacherProfile | undefined;
        id: string;
        login: string;
        role: import("../common/types/roles.enum").Role;
        email: string;
        phone?: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        avatarUrl?: string;
        status: "active" | "blocked";
        createdAt: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
