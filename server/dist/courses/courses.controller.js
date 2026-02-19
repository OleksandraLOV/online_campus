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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_enum_1 = require("../common/types/roles.enum");
let CoursesController = class CoursesController {
    coursesService;
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    findAll() {
        return this.coursesService.findAllCourses();
    }
    findMy(req) {
        const { sub, role } = req.user;
        if (role === roles_enum_1.Role.STUDENT) {
            return this.coursesService.findCoursesByStudent(sub);
        }
        if (role === roles_enum_1.Role.TEACHER || role === roles_enum_1.Role.DEPARTMENT_HEAD) {
            return this.coursesService.findCoursesByTeacher(sub);
        }
        return this.coursesService.findAllCourses();
    }
    getMaterials(caId) {
        return this.coursesService.findMaterials(caId);
    }
    getAssignments(caId) {
        return this.coursesService.findAssignments(caId);
    }
    getGradeJournal(caId) {
        return this.coursesService.findGradesByCourseAssignment(caId);
    }
    getMyAssignments(req) {
        return this.coursesService.findAssignmentsByStudent(req.user.sub);
    }
    getMyGrades(req) {
        return this.coursesService.findGradesByStudent(req.user.sub);
    }
    getSubmissions(assignmentId) {
        return this.coursesService.findSubmissions(assignmentId);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "findMy", null);
__decorate([
    (0, common_1.Get)(':courseAssignmentId/materials'),
    __param(0, (0, common_1.Param)('courseAssignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getMaterials", null);
__decorate([
    (0, common_1.Get)(':courseAssignmentId/assignments'),
    __param(0, (0, common_1.Param)('courseAssignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getAssignments", null);
__decorate([
    (0, common_1.Get)(':courseAssignmentId/grades'),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.TEACHER, roles_enum_1.Role.DEPARTMENT_HEAD, roles_enum_1.Role.DEAN, roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('courseAssignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getGradeJournal", null);
__decorate([
    (0, common_1.Get)('assignments/my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getMyAssignments", null);
__decorate([
    (0, common_1.Get)('grades/my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getMyGrades", null);
__decorate([
    (0, common_1.Get)('assignments/:assignmentId/submissions'),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.TEACHER, roles_enum_1.Role.DEPARTMENT_HEAD, roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getSubmissions", null);
exports.CoursesController = CoursesController = __decorate([
    (0, common_1.Controller)('courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map