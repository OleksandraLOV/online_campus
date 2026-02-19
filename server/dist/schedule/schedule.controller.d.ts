import { ScheduleService } from './schedule.service';
export declare class ScheduleController {
    private scheduleService;
    constructor(scheduleService: ScheduleService);
    findAll(date?: string, groupId?: string, teacherId?: string): {
        courseName: string | undefined;
        courseCode: string | undefined;
        groupCode: string | undefined;
        teacherId: string | undefined;
        classroom: string;
        id: string;
        courseAssignmentId: string;
        classroomId?: string;
        date: string;
        startTime: string;
        endTime: string;
        type: "lecture" | "seminar" | "lab" | "exam" | "consultation";
        status: "scheduled" | "cancelled" | "rescheduled";
    }[];
    findMy(req: any): {
        courseName: string | undefined;
        courseCode: string | undefined;
        groupCode: string | undefined;
        teacherId: string | undefined;
        classroom: string;
        id: string;
        courseAssignmentId: string;
        classroomId?: string;
        date: string;
        startTime: string;
        endTime: string;
        type: "lecture" | "seminar" | "lab" | "exam" | "consultation";
        status: "scheduled" | "cancelled" | "rescheduled";
    }[];
    create(body: any): {
        courseName: string | undefined;
        courseCode: string | undefined;
        groupCode: string | undefined;
        teacherId: string | undefined;
        classroom: string;
        id: string;
        courseAssignmentId: string;
        classroomId?: string;
        date: string;
        startTime: string;
        endTime: string;
        type: "lecture" | "seminar" | "lab" | "exam" | "consultation";
        status: "scheduled" | "cancelled" | "rescheduled";
    };
    update(id: string, body: any): {
        courseName: string | undefined;
        courseCode: string | undefined;
        groupCode: string | undefined;
        teacherId: string | undefined;
        classroom: string;
        id: string;
        courseAssignmentId: string;
        classroomId?: string;
        date: string;
        startTime: string;
        endTime: string;
        type: "lecture" | "seminar" | "lab" | "exam" | "consultation";
        status: "scheduled" | "cancelled" | "rescheduled";
    };
    delete(id: string): {
        deleted: boolean;
    };
}
