import { CoursesService } from './courses.service';
export declare class CoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    findAll(): import("../common/types/entities").Course[];
    findMy(req: any): import("../common/types/entities").Course[] | {
        courseName: string | undefined;
        courseCode: string | undefined;
        credits: number | undefined;
        teacherName: string | undefined;
        id: string;
        courseId: string;
        groupId: string;
        teacherId: string;
        academicYear: string;
        semester: number;
    }[] | {
        courseName: string | undefined;
        courseCode: string | undefined;
        credits: number | undefined;
        groupCode: string | undefined;
        groupSpecialty: string | undefined;
        id: string;
        courseId: string;
        groupId: string;
        teacherId: string;
        academicYear: string;
        semester: number;
    }[];
    getMaterials(caId: string): import("../common/types/entities").Material[];
    getAssignments(caId: string): import("../common/types/entities").Assignment[];
    getGradeJournal(caId: string): {
        studentId: string;
        studentName: string | undefined;
        grades: import("../common/types/entities").Grade[];
    }[];
    getMyAssignments(req: any): {
        courseName: string | undefined;
        submission: import("../common/types/entities").Submission | null;
        id: string;
        courseAssignmentId: string;
        title: string;
        description: string;
        dueDate: string;
        maxScore: number;
    }[];
    getMyGrades(req: any): {
        courseName: string | undefined;
        courseCode: string | undefined;
        id: string;
        studentId: string;
        courseAssignmentId: string;
        date: string;
        type: "current" | "module" | "exam" | "final";
        value: number;
        comment?: string;
    }[];
    getSubmissions(assignmentId: string): {
        studentName: string | undefined;
        id: string;
        assignmentId: string;
        studentId: string;
        submittedAt: string;
        fileLink?: string;
        score?: number;
        comment?: string;
        status: "submitted" | "graded" | "returned";
    }[];
}
