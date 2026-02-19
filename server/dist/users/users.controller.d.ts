import { UsersService } from './users.service';
import { Role } from '../common/types/roles.enum';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(role?: Role): {
        id: string;
        login: string;
        role: Role;
        email: string;
        phone?: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        avatarUrl?: string;
        status: "active" | "blocked";
        createdAt: string;
    }[];
    search(query: string): {
        id: string;
        login: string;
        role: Role;
        email: string;
        phone?: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        avatarUrl?: string;
        status: "active" | "blocked";
        createdAt: string;
    }[];
    getStudentsByGroup(groupId: string): {
        studentProfile: import("../common/types/entities").StudentProfile | undefined;
        id: string;
        login: string;
        role: Role;
        email: string;
        phone?: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        avatarUrl?: string;
        status: "active" | "blocked";
        createdAt: string;
    }[];
    getTeachersByDepartment(departmentId: string): {
        teacherProfile: import("../common/types/entities").TeacherProfile | undefined;
        id: string;
        login: string;
        role: Role;
        email: string;
        phone?: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        avatarUrl?: string;
        status: "active" | "blocked";
        createdAt: string;
    }[];
    findOne(id: string): {
        studentProfile: import("../common/types/entities").StudentProfile | undefined;
        teacherProfile: import("../common/types/entities").TeacherProfile | undefined;
        group: import("../common/types/entities").Group | undefined;
        department: import("../common/types/entities").Department | undefined;
        id: string;
        login: string;
        role: Role;
        email: string;
        phone?: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        avatarUrl?: string;
        status: "active" | "blocked";
        createdAt: string;
    };
}
