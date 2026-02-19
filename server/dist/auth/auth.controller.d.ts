import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        login: string;
        password: string;
    }): Promise<{
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
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(req: any): Promise<{
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
}
