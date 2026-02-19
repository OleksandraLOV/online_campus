"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const mock_data_1 = require("../common/mock-data");
let CoursesService = class CoursesService {
    findAllCourses() {
        return mock_data_1.courses;
    }
    findCoursesByStudent(studentId) {
        const profile = mock_data_1.studentProfiles.find((p) => p.userId === studentId);
        if (!profile)
            return [];
        const cas = mock_data_1.courseAssignments.filter((ca) => ca.groupId === profile.groupId);
        return cas.map((ca) => {
            const course = mock_data_1.courses.find((c) => c.id === ca.courseId);
            const teacher = mock_data_1.users.find((u) => u.id === ca.teacherId);
            return {
                ...ca,
                courseName: course?.name,
                courseCode: course?.code,
                credits: course?.credits,
                teacherName: teacher ? `${teacher.lastName} ${teacher.firstName[0]}.${teacher.middleName ? ' ' + teacher.middleName[0] + '.' : ''}` : undefined,
            };
        });
    }
    findCoursesByTeacher(teacherId) {
        const cas = mock_data_1.courseAssignments.filter((ca) => ca.teacherId === teacherId);
        return cas.map((ca) => {
            const course = mock_data_1.courses.find((c) => c.id === ca.courseId);
            const group = mock_data_1.groups.find((g) => g.id === ca.groupId);
            return {
                ...ca,
                courseName: course?.name,
                courseCode: course?.code,
                credits: course?.credits,
                groupCode: group?.code,
                groupSpecialty: group?.specialty,
            };
        });
    }
    findMaterials(courseAssignmentId) {
        return mock_data_1.materials.filter((m) => m.courseAssignmentId === courseAssignmentId);
    }
    findAssignments(courseAssignmentId) {
        return mock_data_1.assignments.filter((a) => a.courseAssignmentId === courseAssignmentId);
    }
    findAssignmentsByStudent(studentId) {
        const profile = mock_data_1.studentProfiles.find((p) => p.userId === studentId);
        if (!profile)
            return [];
        const caIds = mock_data_1.courseAssignments
            .filter((ca) => ca.groupId === profile.groupId)
            .map((ca) => ca.id);
        return mock_data_1.assignments
            .filter((a) => caIds.includes(a.courseAssignmentId))
            .map((a) => {
            const ca = mock_data_1.courseAssignments.find((c) => c.id === a.courseAssignmentId);
            const course = ca ? mock_data_1.courses.find((c) => c.id === ca.courseId) : null;
            const sub = mock_data_1.submissions.find((s) => s.assignmentId === a.id && s.studentId === studentId);
            return {
                ...a,
                courseName: course?.name,
                submission: sub || null,
            };
        });
    }
    findSubmissions(assignmentId) {
        return mock_data_1.submissions
            .filter((s) => s.assignmentId === assignmentId)
            .map((s) => {
            const student = mock_data_1.users.find((u) => u.id === s.studentId);
            return {
                ...s,
                studentName: student ? `${student.lastName} ${student.firstName}` : undefined,
            };
        });
    }
    findGradesByStudent(studentId) {
        return mock_data_1.grades
            .filter((g) => g.studentId === studentId)
            .map((g) => {
            const ca = mock_data_1.courseAssignments.find((c) => c.id === g.courseAssignmentId);
            const course = ca ? mock_data_1.courses.find((c) => c.id === ca.courseId) : null;
            return {
                ...g,
                courseName: course?.name,
                courseCode: course?.code,
            };
        });
    }
    findGradesByCourseAssignment(courseAssignmentId) {
        const ca = mock_data_1.courseAssignments.find((c) => c.id === courseAssignmentId);
        if (!ca)
            return [];
        const studentIds = mock_data_1.studentProfiles
            .filter((p) => p.groupId === ca.groupId)
            .map((p) => p.userId);
        return studentIds.map((sid) => {
            const student = mock_data_1.users.find((u) => u.id === sid);
            const studentGrades = mock_data_1.grades.filter((g) => g.studentId === sid && g.courseAssignmentId === courseAssignmentId);
            return {
                studentId: sid,
                studentName: student ? `${student.lastName} ${student.firstName}` : undefined,
                grades: studentGrades,
            };
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)()
], CoursesService);
//# sourceMappingURL=courses.service.js.map