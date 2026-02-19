export declare class CoursesService {
    findAllCourses(): import("../common/types/entities").Course[];
    findCoursesByStudent(studentId: string): {
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
    }[];
    findCoursesByTeacher(teacherId: string): {
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
    findMaterials(courseAssignmentId: string): import("../common/types/entities").Material[];
    findAssignments(courseAssignmentId: string): import("../common/types/entities").Assignment[];
    findAssignmentsByStudent(studentId: string): {
        courseName: string | undefined;
        submission: import("../common/types/entities").Submission | null;
        id: string;
        courseAssignmentId: string;
        title: string;
        description: string;
        dueDate: string;
        maxScore: number;
    }[];
    findSubmissions(assignmentId: string): {
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
    findGradesByStudent(studentId: string): {
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
    findGradesByCourseAssignment(courseAssignmentId: string): {
        studentId: string;
        studentName: string | undefined;
        grades: import("../common/types/entities").Grade[];
    }[];
}
