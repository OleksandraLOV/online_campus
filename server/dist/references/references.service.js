"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferencesService = void 0;
const common_1 = require("@nestjs/common");
const mock_data_1 = require("../common/mock-data");
let ReferencesService = class ReferencesService {
    getGroups() {
        return mock_data_1.groups;
    }
    getClassrooms() {
        return mock_data_1.classrooms;
    }
    getDepartments() {
        return mock_data_1.departments;
    }
    getFaculties() {
        return mock_data_1.faculties;
    }
};
exports.ReferencesService = ReferencesService;
exports.ReferencesService = ReferencesService = __decorate([
    (0, common_1.Injectable)()
], ReferencesService);
//# sourceMappingURL=references.service.js.map