import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
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
    refresh(body: RefreshDto): Promise<{
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
