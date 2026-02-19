"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mock_data_1 = require("../common/mock-data");
let UsersService = class UsersService {
    findAll(role) {
        let result = mock_data_1.users;
        if (role) {
            result = result.filter((u) => u.role === role);
        }
        return result.map(({ passwordHash, ...u }) => u);
    }
    findOne(id) {
        const user = mock_data_1.users.find((u) => u.id === id);
        if (!user)
            throw new common_1.NotFoundException('Користувача не знайдено');
        const { passwordHash, ...userWithoutPassword } = user;
        const studentProfile = mock_data_1.studentProfiles.find((p) => p.userId === id);
        const teacherProfile = mock_data_1.teacherProfiles.find((p) => p.userId === id);
        let group = null;
        let department = null;
        if (studentProfile) {
            group = mock_data_1.groups.find((g) => g.id === studentProfile.groupId);
        }
        if (teacherProfile) {
            department = mock_data_1.departments.find((d) => d.id === teacherProfile.departmentId);
        }
        return {
            ...userWithoutPassword,
            studentProfile: studentProfile || undefined,
            teacherProfile: teacherProfile || undefined,
            group: group || undefined,
            department: department || undefined,
        };
    }
    findByName(query) {
        const q = query.toLowerCase();
        return mock_data_1.users
            .filter((u) => u.firstName.toLowerCase().includes(q) ||
            u.lastName.toLowerCase().includes(q) ||
            (u.middleName && u.middleName.toLowerCase().includes(q)))
            .map(({ passwordHash, ...u }) => u);
    }
    getStudentsByGroup(groupId) {
        const studentIds = mock_data_1.studentProfiles
            .filter((p) => p.groupId === groupId)
            .map((p) => p.userId);
        return mock_data_1.users
            .filter((u) => studentIds.includes(u.id))
            .map(({ passwordHash, ...u }) => {
            const profile = mock_data_1.studentProfiles.find((p) => p.userId === u.id);
            return { ...u, studentProfile: profile };
        });
    }
    getTeachersByDepartment(departmentId) {
        const teacherIds = mock_data_1.teacherProfiles
            .filter((p) => p.departmentId === departmentId)
            .map((p) => p.userId);
        return mock_data_1.users
            .filter((u) => teacherIds.includes(u.id))
            .map(({ passwordHash, ...u }) => {
            const profile = mock_data_1.teacherProfiles.find((p) => p.userId === u.id);
            return { ...u, teacherProfile: profile };
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map