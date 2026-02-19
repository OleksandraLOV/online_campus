"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const mock_data_1 = require("../common/mock-data");
let AuthService = class AuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async login(login, password) {
        const user = mock_data_1.users.find((u) => u.login === login);
        if (!user) {
            throw new common_1.UnauthorizedException('Невірний логін або пароль');
        }
        if (user.status === 'blocked') {
            throw new common_1.UnauthorizedException('Обліковий запис заблоковано');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Невірний логін або пароль');
        }
        const payload = { sub: user.id, login: user.login, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const { passwordHash, ...userWithoutPassword } = user;
        const studentProfile = mock_data_1.studentProfiles.find((p) => p.userId === user.id);
        const teacherProfile = mock_data_1.teacherProfiles.find((p) => p.userId === user.id);
        return {
            accessToken,
            refreshToken,
            user: {
                ...userWithoutPassword,
                studentProfile: studentProfile || undefined,
                teacherProfile: teacherProfile || undefined,
            },
        };
    }
    async getProfile(userId) {
        const user = mock_data_1.users.find((u) => u.id === userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Користувача не знайдено');
        }
        const { passwordHash, ...userWithoutPassword } = user;
        const studentProfile = mock_data_1.studentProfiles.find((p) => p.userId === user.id);
        const teacherProfile = mock_data_1.teacherProfiles.find((p) => p.userId === user.id);
        return {
            ...userWithoutPassword,
            studentProfile: studentProfile || undefined,
            teacherProfile: teacherProfile || undefined,
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const newPayload = { sub: payload.sub, login: payload.login, role: payload.role };
            return {
                accessToken: this.jwtService.sign(newPayload),
                refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
            };
        }
        catch {
            throw new common_1.UnauthorizedException('Невірний refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map