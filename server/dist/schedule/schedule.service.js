"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const mock_data_1 = require("../common/mock-data");
let ScheduleService = class ScheduleService {
    entries = [...mock_data_1.scheduleEntries];
    findAll() {
        return this.entries.map((entry) => this.enrichEntry(entry));
    }
    findByGroup(groupId) {
        const caIds = mock_data_1.courseAssignments
            .filter((ca) => ca.groupId === groupId)
            .map((ca) => ca.id);
        return this.entries
            .filter((e) => caIds.includes(e.courseAssignmentId))
            .map((entry) => this.enrichEntry(entry));
    }
    findByTeacher(teacherId) {
        const caIds = mock_data_1.courseAssignments
            .filter((ca) => ca.teacherId === teacherId)
            .map((ca) => ca.id);
        return this.entries
            .filter((e) => caIds.includes(e.courseAssignmentId))
            .map((entry) => this.enrichEntry(entry));
    }
    findByStudent(studentId) {
        const profile = mock_data_1.studentProfiles.find((p) => p.userId === studentId);
        if (!profile)
            return [];
        return this.findByGroup(profile.groupId);
    }
    findByDate(date) {
        return this.entries
            .filter((e) => e.date === date)
            .map((entry) => this.enrichEntry(entry));
    }
    create(dto) {
        const conflicts = this.checkConflicts(dto);
        if (conflicts.length > 0) {
            throw new common_1.BadRequestException({ message: 'Конфлікт розкладу', conflicts });
        }
        const entry = { id: `sch-${Date.now()}`, ...dto };
        this.entries.push(entry);
        return this.enrichEntry(entry);
    }
    update(id, dto) {
        const idx = this.entries.findIndex((e) => e.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException('Запис розкладу не знайдено');
        this.entries[idx] = { ...this.entries[idx], ...dto };
        return this.enrichEntry(this.entries[idx]);
    }
    delete(id) {
        const idx = this.entries.findIndex((e) => e.id === id);
        if (idx === -1)
            throw new common_1.NotFoundException('Запис розкладу не знайдено');
        this.entries.splice(idx, 1);
        return { deleted: true };
    }
    checkConflicts(dto) {
        const conflicts = [];
        const ca = mock_data_1.courseAssignments.find((c) => c.id === dto.courseAssignmentId);
        if (!ca)
            return conflicts;
        for (const entry of this.entries) {
            if (entry.date !== dto.date || entry.status === 'cancelled')
                continue;
            if (entry.startTime >= dto.endTime || entry.endTime <= dto.startTime)
                continue;
            const entryCa = mock_data_1.courseAssignments.find((c) => c.id === entry.courseAssignmentId);
            if (!entryCa)
                continue;
            if (entryCa.teacherId === ca.teacherId) {
                conflicts.push(`Викладач зайнятий: ${entry.startTime}-${entry.endTime}`);
            }
            if (dto.classroomId && entry.classroomId === dto.classroomId) {
                conflicts.push(`Аудиторія зайнята: ${entry.startTime}-${entry.endTime}`);
            }
            if (entryCa.groupId === ca.groupId) {
                conflicts.push(`Група зайнята: ${entry.startTime}-${entry.endTime}`);
            }
        }
        return conflicts;
    }
    enrichEntry(entry) {
        const ca = mock_data_1.courseAssignments.find((c) => c.id === entry.courseAssignmentId);
        const course = ca ? mock_data_1.courses.find((c) => c.id === ca.courseId) : null;
        const group = ca ? mock_data_1.groups.find((g) => g.id === ca.groupId) : null;
        const classroom = entry.classroomId
            ? mock_data_1.classrooms.find((r) => r.id === entry.classroomId)
            : null;
        return {
            ...entry,
            courseName: course?.name,
            courseCode: course?.code,
            groupCode: group?.code,
            teacherId: ca?.teacherId,
            classroom: classroom
                ? `${classroom.building}, ауд. ${classroom.roomNumber}`
                : 'Онлайн',
        };
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)()
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map