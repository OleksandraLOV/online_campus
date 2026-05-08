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
exports.ReferencesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/roles.guard");
const roles_enum_1 = require("../common/types/roles.enum");
const dto_1 = require("./dto");
const groups_service_1 = require("./groups.service");
const classrooms_service_1 = require("./classrooms.service");
const departments_service_1 = require("./departments.service");
const faculties_service_1 = require("./faculties.service");
const specialties_service_1 = require("./specialties.service");
let ReferencesController = class ReferencesController {
    groupsService;
    classroomsService;
    departmentsService;
    facultiesService;
    specialtiesService;
    constructor(groupsService, classroomsService, departmentsService, facultiesService, specialtiesService) {
        this.groupsService = groupsService;
        this.classroomsService = classroomsService;
        this.departmentsService = departmentsService;
        this.facultiesService = facultiesService;
        this.specialtiesService = specialtiesService;
    }
    getGroups(course) {
        const query = {};
        if (course) {
            query.course = Number(course);
        }
        return this.groupsService.findAll(query);
    }
    getGroupById(id) {
        return this.groupsService.findById(id);
    }
    createGroup(createGroupDto) {
        return this.groupsService.create(createGroupDto);
    }
    updateGroup(id, updateGroupDto) {
        return this.groupsService.update(id, updateGroupDto);
    }
    removeGroup(id) {
        return this.groupsService.remove(id);
    }
    getClassrooms(type, building) {
        const query = {};
        if (type) {
            query.type = type;
        }
        if (building) {
            query.building = building;
        }
        return this.classroomsService.findAll(query);
    }
    createClassroom(createClassroomDto) {
        return this.classroomsService.create(createClassroomDto);
    }
    updateClassroom(id, updateClassroomDto) {
        return this.classroomsService.update(id, updateClassroomDto);
    }
    removeClassroom(id) {
        return this.classroomsService.remove(id);
    }
    getDepartments() {
        return this.departmentsService.findAll();
    }
    getDepartmentById(id) {
        return this.departmentsService.findById(id);
    }
    createDepartment(createDepartmentDto) {
        return this.departmentsService.create(createDepartmentDto);
    }
    updateDepartment(id, updateDepartmentDto) {
        return this.departmentsService.update(id, updateDepartmentDto);
    }
    removeDepartment(id) {
        return this.departmentsService.remove(id);
    }
    getFaculties() {
        return this.facultiesService.findAll();
    }
    createFaculty(createFacultyDto) {
        return this.facultiesService.create(createFacultyDto);
    }
    updateFaculty(id, updateFacultyDto) {
        return this.facultiesService.update(id, updateFacultyDto);
    }
    removeFaculty(id) {
        return this.facultiesService.remove(id);
    }
    getSpecialties() {
        return this.specialtiesService.findAll();
    }
    createSpecialty(createSpecialtyDto) {
        return this.specialtiesService.create(createSpecialtyDto);
    }
    updateSpecialty(id, updateSpecialtyDto) {
        return this.specialtiesService.update(id, updateSpecialtyDto);
    }
    removeSpecialty(id) {
        return this.specialtiesService.remove(id);
    }
};
exports.ReferencesController = ReferencesController;
__decorate([
    (0, common_1.Get)('groups'),
    (0, swagger_1.ApiQuery)({ name: 'course', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.GroupDto] }),
    __param(0, (0, common_1.Query)('course')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "getGroups", null);
__decorate([
    (0, common_1.Get)('groups/:id'),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.GroupDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "getGroupById", null);
__decorate([
    (0, common_1.Post)('groups'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: String,
        description: 'The ID of the created group.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGroupDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Put)('groups/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: String,
        description: 'The ID of the updated group.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateGroupDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Delete)('groups/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Group successfully deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "removeGroup", null);
__decorate([
    (0, common_1.Get)('classrooms'),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'building', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.ClassroomDto] }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('building')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "getClassrooms", null);
__decorate([
    (0, common_1.Post)('classrooms'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: String,
        description: 'The ID of the created classroom.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateClassroomDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "createClassroom", null);
__decorate([
    (0, common_1.Put)('classrooms/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: String,
        description: 'The ID of the updated classroom.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateClassroomDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "updateClassroom", null);
__decorate([
    (0, common_1.Delete)('classrooms/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Classroom successfully deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "removeClassroom", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.DepartmentDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('departments/:id'),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.DepartmentDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "getDepartmentById", null);
__decorate([
    (0, common_1.Post)('departments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: String,
        description: 'The ID of the created department.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateDepartmentDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Put)('departments/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: String,
        description: 'The ID of the updated department.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateDepartmentDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "updateDepartment", null);
__decorate([
    (0, common_1.Delete)('departments/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Department successfully deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "removeDepartment", null);
__decorate([
    (0, common_1.Get)('faculties'),
    (0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.FacultyDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "getFaculties", null);
__decorate([
    (0, common_1.Post)('faculties'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: String,
        description: 'The ID of the created faculty.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateFacultyDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "createFaculty", null);
__decorate([
    (0, common_1.Put)('faculties/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: String,
        description: 'The ID of the updated faculty.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateFacultyDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "updateFaculty", null);
__decorate([
    (0, common_1.Delete)('faculties/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Faculty successfully deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "removeFaculty", null);
__decorate([
    (0, common_1.Get)('specialties'),
    (0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.SpecialtyDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "getSpecialties", null);
__decorate([
    (0, common_1.Post)('specialties'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: String,
        description: 'The ID of the created specialty.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateSpecialtyDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "createSpecialty", null);
__decorate([
    (0, common_1.Put)('specialties/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: String,
        description: 'The ID of the updated specialty.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateSpecialtyDto]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "updateSpecialty", null);
__decorate([
    (0, common_1.Delete)('specialties/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Specialty successfully deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReferencesController.prototype, "removeSpecialty", null);
exports.ReferencesController = ReferencesController = __decorate([
    (0, swagger_1.ApiTags)('references'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('references'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [groups_service_1.GroupsService,
        classrooms_service_1.ClassroomsService,
        departments_service_1.DepartmentsService,
        faculties_service_1.FacultiesService,
        specialties_service_1.SpecialtiesService])
], ReferencesController);
//# sourceMappingURL=references.controller.js.map