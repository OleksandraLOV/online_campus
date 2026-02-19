import { Role } from '../types/roles.enum';
import * as bcrypt from 'bcryptjs';
import {
  User, StudentProfile, TeacherProfile, Group, Department, Faculty,
  Course, CourseAssignment, Classroom, ScheduleEntry, Material,
  Assignment, Submission, Grade, Notification,
} from '../types/entities';

const hash = bcrypt.hashSync('password123', 10);

// ============ FACULTIES & DEPARTMENTS ============

export const faculties: Faculty[] = [
  { id: 'fac-1', name: 'Факультет комп\'ютерних та інформаційних технологій', deanUserId: 'user-dean-1' },
  { id: 'fac-2', name: 'Факультет права та міжнародних відносин', deanUserId: 'user-dean-2' },
];

export const departments: Department[] = [
  { id: 'dep-1', name: 'Кафедра інформаційних технологій', facultyId: 'fac-1', headUserId: 'user-head-1' },
  { id: 'dep-2', name: 'Кафедра програмної інженерії', facultyId: 'fac-1', headUserId: 'user-head-2' },
  { id: 'dep-3', name: 'Кафедра міжнародного права', facultyId: 'fac-2' },
];

// ============ USERS ============

export const users: User[] = [
  // Students
  { id: 'user-s1', login: 'student1', passwordHash: hash, role: Role.STUDENT, email: 'student1@maup.com.ua', phone: '+380991111111', firstName: 'Олександр', lastName: 'Петренко', middleName: 'Іванович', status: 'active', createdAt: '2024-09-01' },
  { id: 'user-s2', login: 'student2', passwordHash: hash, role: Role.STUDENT, email: 'student2@maup.com.ua', phone: '+380992222222', firstName: 'Марія', lastName: 'Коваленко', middleName: 'Сергіївна', status: 'active', createdAt: '2024-09-01' },
  { id: 'user-s3', login: 'student3', passwordHash: hash, role: Role.STUDENT, email: 'student3@maup.com.ua', firstName: 'Андрій', lastName: 'Шевченко', status: 'active', createdAt: '2024-09-01' },
  { id: 'user-s4', login: 'student4', passwordHash: hash, role: Role.STUDENT, email: 'student4@maup.com.ua', firstName: 'Ірина', lastName: 'Бондаренко', status: 'active', createdAt: '2024-09-01' },

  // Teachers
  { id: 'user-t1', login: 'teacher1', passwordHash: hash, role: Role.TEACHER, email: 'teacher1@maup.com.ua', firstName: 'Віктор', lastName: 'Мельник', middleName: 'Олегович', status: 'active', createdAt: '2024-08-01' },
  { id: 'user-t2', login: 'teacher2', passwordHash: hash, role: Role.TEACHER, email: 'teacher2@maup.com.ua', firstName: 'Наталія', lastName: 'Кравченко', middleName: 'Петрівна', status: 'active', createdAt: '2024-08-01' },
  { id: 'user-t3', login: 'teacher3', passwordHash: hash, role: Role.TEACHER, email: 'teacher3@maup.com.ua', firstName: 'Сергій', lastName: 'Ткаченко', status: 'active', createdAt: '2024-08-01' },

  // Dispatcher
  { id: 'user-d1', login: 'dispatcher1', passwordHash: hash, role: Role.DISPATCHER, email: 'dispatcher@maup.com.ua', firstName: 'Олена', lastName: 'Савченко', status: 'active', createdAt: '2024-08-01' },

  // Department Heads
  { id: 'user-head-1', login: 'head1', passwordHash: hash, role: Role.DEPARTMENT_HEAD, email: 'head1@maup.com.ua', firstName: 'Петро', lastName: 'Григоренко', middleName: 'Васильович', status: 'active', createdAt: '2024-01-01' },
  { id: 'user-head-2', login: 'head2', passwordHash: hash, role: Role.DEPARTMENT_HEAD, email: 'head2@maup.com.ua', firstName: 'Ганна', lastName: 'Литвиненко', status: 'active', createdAt: '2024-01-01' },

  // Deans
  { id: 'user-dean-1', login: 'dean1', passwordHash: hash, role: Role.DEAN, email: 'dean1@maup.com.ua', firstName: 'Михайло', lastName: 'Козлов', middleName: 'Андрійович', status: 'active', createdAt: '2024-01-01' },
  { id: 'user-dean-2', login: 'dean2', passwordHash: hash, role: Role.DEAN, email: 'dean2@maup.com.ua', firstName: 'Тетяна', lastName: 'Іванова', status: 'active', createdAt: '2024-01-01' },

  // Rector
  { id: 'user-rector', login: 'rector', passwordHash: hash, role: Role.RECTOR, email: 'rector@maup.com.ua', firstName: 'Володимир', lastName: 'Сидоренко', middleName: 'Миколайович', status: 'active', createdAt: '2023-01-01' },

  // President
  { id: 'user-president', login: 'president', passwordHash: hash, role: Role.PRESIDENT, email: 'president@maup.com.ua', firstName: 'Юрій', lastName: 'Головко', middleName: 'Борисович', status: 'active', createdAt: '2023-01-01' },

  // Admin
  { id: 'user-admin', login: 'admin', passwordHash: hash, role: Role.ADMIN, email: 'admin@maup.com.ua', firstName: 'Адмін', lastName: 'Системний', status: 'active', createdAt: '2023-01-01' },
];

// ============ PROFILES ============

export const studentProfiles: StudentProfile[] = [
  { userId: 'user-s1', groupId: 'grp-1', recordBookNumber: 'КН-2024-001', year: 1 },
  { userId: 'user-s2', groupId: 'grp-1', recordBookNumber: 'КН-2024-002', year: 1 },
  { userId: 'user-s3', groupId: 'grp-2', recordBookNumber: 'ПІ-2024-001', year: 2 },
  { userId: 'user-s4', groupId: 'grp-2', recordBookNumber: 'ПІ-2024-002', year: 2 },
];

export const teacherProfiles: TeacherProfile[] = [
  { userId: 'user-t1', departmentId: 'dep-1', position: 'Доцент' },
  { userId: 'user-t2', departmentId: 'dep-1', position: 'Старший викладач' },
  { userId: 'user-t3', departmentId: 'dep-2', position: 'Професор' },
  { userId: 'user-head-1', departmentId: 'dep-1', position: 'Завідувач кафедри' },
  { userId: 'user-head-2', departmentId: 'dep-2', position: 'Завідувач кафедри' },
];

// ============ GROUPS ============

export const groups: Group[] = [
  { id: 'grp-1', code: 'КН-11', specialty: 'Комп\'ютерні науки', course: 1, curatorTeacherId: 'user-t1' },
  { id: 'grp-2', code: 'ПІ-21', specialty: 'Програмна інженерія', course: 2, curatorTeacherId: 'user-t3' },
  { id: 'grp-3', code: 'КН-31', specialty: 'Комп\'ютерні науки', course: 3 },
];

// ============ COURSES ============

export const courses: Course[] = [
  { id: 'crs-1', name: 'Основи програмування', code: 'CS101', departmentId: 'dep-1', semester: 1, credits: 5 },
  { id: 'crs-2', name: 'Бази даних', code: 'CS201', departmentId: 'dep-1', semester: 2, credits: 4 },
  { id: 'crs-3', name: 'Веб-технології', code: 'SE301', departmentId: 'dep-2', semester: 1, credits: 4 },
  { id: 'crs-4', name: 'Алгоритми та структури даних', code: 'CS102', departmentId: 'dep-1', semester: 1, credits: 5 },
  { id: 'crs-5', name: 'Операційні системи', code: 'CS202', departmentId: 'dep-2', semester: 2, credits: 3 },
];

// ============ COURSE ASSIGNMENTS ============

export const courseAssignments: CourseAssignment[] = [
  { id: 'ca-1', courseId: 'crs-1', groupId: 'grp-1', teacherId: 'user-t1', academicYear: '2024-2025', semester: 1 },
  { id: 'ca-2', courseId: 'crs-4', groupId: 'grp-1', teacherId: 'user-t2', academicYear: '2024-2025', semester: 1 },
  { id: 'ca-3', courseId: 'crs-2', groupId: 'grp-2', teacherId: 'user-t1', academicYear: '2024-2025', semester: 2 },
  { id: 'ca-4', courseId: 'crs-3', groupId: 'grp-2', teacherId: 'user-t3', academicYear: '2024-2025', semester: 1 },
  { id: 'ca-5', courseId: 'crs-5', groupId: 'grp-1', teacherId: 'user-t3', academicYear: '2024-2025', semester: 2 },
];

// ============ CLASSROOMS ============

export const classrooms: Classroom[] = [
  { id: 'room-1', building: 'Корпус 1', roomNumber: '101', capacity: 30, type: 'lecture' },
  { id: 'room-2', building: 'Корпус 1', roomNumber: '205', capacity: 20, type: 'lab' },
  { id: 'room-3', building: 'Корпус 2', roomNumber: '301', capacity: 50, type: 'lecture' },
  { id: 'room-4', building: 'Корпус 2', roomNumber: '102', capacity: 15, type: 'seminar' },
  { id: 'room-5', building: 'Онлайн', roomNumber: 'Zoom', capacity: 100, type: 'online' },
];

// ============ SCHEDULE ============

export const scheduleEntries: ScheduleEntry[] = [
  { id: 'sch-1', courseAssignmentId: 'ca-1', classroomId: 'room-1', date: '2025-02-17', startTime: '08:30', endTime: '10:05', type: 'lecture', status: 'scheduled' },
  { id: 'sch-2', courseAssignmentId: 'ca-2', classroomId: 'room-2', date: '2025-02-17', startTime: '10:15', endTime: '11:50', type: 'lab', status: 'scheduled' },
  { id: 'sch-3', courseAssignmentId: 'ca-1', classroomId: 'room-4', date: '2025-02-18', startTime: '08:30', endTime: '10:05', type: 'seminar', status: 'scheduled' },
  { id: 'sch-4', courseAssignmentId: 'ca-4', classroomId: 'room-3', date: '2025-02-17', startTime: '12:00', endTime: '13:35', type: 'lecture', status: 'scheduled' },
  { id: 'sch-5', courseAssignmentId: 'ca-4', classroomId: 'room-5', date: '2025-02-19', startTime: '10:15', endTime: '11:50', type: 'seminar', status: 'scheduled' },
  { id: 'sch-6', courseAssignmentId: 'ca-2', classroomId: 'room-1', date: '2025-02-19', startTime: '08:30', endTime: '10:05', type: 'lecture', status: 'scheduled' },
  { id: 'sch-7', courseAssignmentId: 'ca-1', classroomId: 'room-2', date: '2025-02-20', startTime: '10:15', endTime: '11:50', type: 'lab', status: 'cancelled' },
];

// ============ MATERIALS ============

export const materials: Material[] = [
  { id: 'mat-1', courseAssignmentId: 'ca-1', title: 'Вступ до програмування', description: 'Лекція 1: Основні поняття', fileLink: '/files/lecture1.pdf', publishDate: '2025-02-10' },
  { id: 'mat-2', courseAssignmentId: 'ca-1', title: 'Змінні та типи даних', description: 'Лекція 2: Типи даних у JavaScript', fileLink: '/files/lecture2.pdf', publishDate: '2025-02-12' },
  { id: 'mat-3', courseAssignmentId: 'ca-4', title: 'HTML та CSS основи', description: 'Базові елементи веб-розробки', fileLink: '/files/web-basics.pdf', publishDate: '2025-02-11' },
];

// ============ ASSIGNMENTS ============

export const assignments: Assignment[] = [
  { id: 'asgn-1', courseAssignmentId: 'ca-1', title: 'Лабораторна робота №1', description: 'Написати програму калькулятор на JavaScript', dueDate: '2025-02-24', maxScore: 10 },
  { id: 'asgn-2', courseAssignmentId: 'ca-1', title: 'Лабораторна робота №2', description: 'Реалізувати масиви та цикли', dueDate: '2025-03-03', maxScore: 10 },
  { id: 'asgn-3', courseAssignmentId: 'ca-4', title: 'Практична робота №1', description: 'Створити адаптивну HTML-сторінку', dueDate: '2025-02-28', maxScore: 15 },
];

// ============ SUBMISSIONS ============

export const submissions: Submission[] = [
  { id: 'sub-1', assignmentId: 'asgn-1', studentId: 'user-s1', submittedAt: '2025-02-20T14:30:00Z', fileLink: '/uploads/sub1.zip', score: 9, comment: 'Відмінна робота!', status: 'graded' },
  { id: 'sub-2', assignmentId: 'asgn-1', studentId: 'user-s2', submittedAt: '2025-02-21T10:00:00Z', fileLink: '/uploads/sub2.zip', status: 'submitted' },
  { id: 'sub-3', assignmentId: 'asgn-3', studentId: 'user-s3', submittedAt: '2025-02-25T09:15:00Z', fileLink: '/uploads/sub3.zip', score: 13, comment: 'Добре, але потрібно покращити адаптивність', status: 'graded' },
];

// ============ GRADES ============

export const grades: Grade[] = [
  { id: 'grd-1', studentId: 'user-s1', courseAssignmentId: 'ca-1', date: '2025-02-17', type: 'current', value: 9, comment: 'Активна робота на занятті' },
  { id: 'grd-2', studentId: 'user-s2', courseAssignmentId: 'ca-1', date: '2025-02-17', type: 'current', value: 7 },
  { id: 'grd-3', studentId: 'user-s1', courseAssignmentId: 'ca-2', date: '2025-02-17', type: 'current', value: 8 },
  { id: 'grd-4', studentId: 'user-s3', courseAssignmentId: 'ca-4', date: '2025-02-18', type: 'current', value: 12 },
  { id: 'grd-5', studentId: 'user-s4', courseAssignmentId: 'ca-4', date: '2025-02-18', type: 'current', value: 14, comment: 'Чудова робота' },
];

// ============ NOTIFICATIONS ============

export const notifications: Notification[] = [
  { id: 'ntf-1', userId: 'user-s1', type: 'new_assignment', title: 'Нове завдання', message: 'Опубліковано "Лабораторна робота №1" з дисципліни "Основи програмування"', createdAt: '2025-02-15T08:00:00Z', readFlag: false },
  { id: 'ntf-2', userId: 'user-s1', type: 'grade', title: 'Нова оцінка', message: 'Ви отримали оцінку 9 з дисципліни "Основи програмування"', createdAt: '2025-02-17T12:00:00Z', readFlag: true },
  { id: 'ntf-3', userId: 'user-s1', type: 'schedule_change', title: 'Зміна розкладу', message: 'Заняття "Основи програмування" 20.02 скасовано', createdAt: '2025-02-19T09:00:00Z', readFlag: false },
  { id: 'ntf-4', userId: 'user-s2', type: 'announcement', title: 'Оголошення', message: 'Збори групи КН-11 о 15:00 в ауд. 101', createdAt: '2025-02-16T10:00:00Z', readFlag: false },
  { id: 'ntf-5', userId: 'user-t1', type: 'system', title: 'Система', message: 'Розклад на наступний тиждень затверджено', createdAt: '2025-02-14T16:00:00Z', readFlag: true },
];
