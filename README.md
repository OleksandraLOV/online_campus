# Електронний Кампус МАУП

Веб-додаток для підтримки навчального процесу Міжрегіональної Академії Управління Персоналом (МАУП).

---

## 1. Огляд проєкту

Система забезпечує веб-доступ до розкладу занять, навчальних матеріалів, завдань, результатів навчання та сервісів комунікації для всіх учасників навчального процесу.

### Ключові можливості

- Особисті кабінети для 8 ролей користувачів
- Ведення та публікація розкладу з перевіркою конфліктів
- Управління навчальними матеріалами й завданнями
- Облік успішності та відвідуваності
- Система сповіщень та оголошень
- Рольова модель доступу (RBAC) з ієрархією

---

## 2. Технологічний стек

| Шар | Технологія |
|-----|-----------|
| **Backend** | Node.js, NestJS, TypeScript |
| **Frontend** | React 19, TypeScript, Vite |
| **Стилі** | Tailwind CSS 4 |
| **Стан (фронт)** | Zustand |
| **HTTP клієнт** | Axios |
| **Аутентифікація** | JWT (access + refresh tokens), Passport.js |
| **Контейнеризація** | Docker, Docker Compose |

---

## 3. Архітектура

```
┌──────────────────┐       ┌──────────────────┐
│                  │       │                  │
│   React Client   │──────▶│  NestJS Server   │
│   (port 5173)    │  API  │   (port 3000)    │
│                  │       │                  │
└──────────────────┘       └──────────────────┘
     Vite + Tailwind         JWT + RBAC Guards
     Zustand Store           Mock Data Layer
     Axios + Interceptors    Modular Architecture
```

### Архітектура бекенду (NestJS модулі)

```
AppModule
├── AuthModule          — логін, JWT, refresh tokens
├── UsersModule         — CRUD користувачів, пошук
├── ScheduleModule      — розклад, перевірка конфліктів
├── CoursesModule       — дисципліни, матеріали, завдання, оцінки
├── ReferencesModule    — довідники (групи, аудиторії, кафедри, факультети)
└── NotificationsModule — сповіщення, статус прочитання
```

### Архітектура фронтенду

```
App
├── LoginPage                    — вхід, тестові акаунти
└── Layout (authenticated)
    ├── DashboardPage            — профіль, розклад дня, сповіщення
    ├── SchedulePage             — розклад (день/тиждень)
    ├── CoursesPage              — мої дисципліни
    ├── AssignmentsPage          — завдання студента
    ├── GradesPage               — оцінки студента
    ├── NotificationsPage        — сповіщення
    └── UsersPage                — управління користувачами (адмін)
```

---

## 4. Дизайн-план розробки

### Фаза 1 — MVP (поточна реалізація)

**Мета:** робочий прототип з аутентифікацією, розкладом і кабінетами студента/викладача.

| Крок | Що зроблено | Деталі |
|------|-------------|--------|
| 1 | Ініціалізація проєктів | NestJS (server/), React+Vite (client/) |
| 2 | Типи та моделі даних | 13 сутностей, enum ролей, ієрархія RBAC |
| 3 | Mock-дані | 15 користувачів (усі 8 ролей), групи, дисципліни, розклад, оцінки, завдання, сповіщення |
| 4 | Auth модуль | JWT access/refresh, логін, профіль, Passport strategy |
| 5 | RBAC Guards | Декоратор @Roles(), перевірка ієрархії ролей |
| 6 | Модуль розкладу | CRUD, перевірка конфліктів (викладач/аудиторія/група), фільтри |
| 7 | Модуль дисциплін | Дисципліни, матеріали, завдання, здачі, оцінки |
| 8 | Модуль довідників | Групи, аудиторії, кафедри, факультети |
| 9 | Модуль сповіщень | Список, лічильник непрочитаних, позначення прочитаними |
| 10 | Модуль користувачів | Список, пошук за ПІБ, фільтр за роллю |
| 11 | React: Auth flow | Zustand store, Axios interceptors (auto-refresh), ProtectedRoute |
| 12 | React: Layout | Sidebar з навігацією за роллю, header |
| 13 | React: Сторінки | Login, Dashboard, Schedule, Courses, Assignments, Grades, Notifications, Users |
| 14 | Docker | Dockerfile для server/client, docker-compose |

### Фаза 2 — Розширення (плановано)

- Підключення MongoDB через Prisma
- CRUD операції для всіх сутностей (створення/редагування/видалення)
- Завантаження файлів (матеріали, здачі завдань)
- Модуль відвідуваності
- Кабінет диспетчера розкладу (повний CRUD, масові операції)

### Фаза 3 — Адміністративний контроль

- Кабінет завідувача кафедри (звіти, навантаження)
- Кабінет декана (схвалення розкладів, факультетські звіти)
- Кабінет ректора та президента (загальні звіти)
- Експорт у XLS/CSV
- Вибіркові дисципліни

### Фаза 4 — Production

- HTTPS, rate limiting, helmet
- Логування дій (audit log)
- Інтеграція з Moodle / Google Classroom
- i18n (українська + англійська)
- Email-сповіщення
- CI/CD pipeline

---

## 5. Модель даних

### Діаграма сутностей

```
User (8 ролей)
├── StudentProfile ──▶ Group
├── TeacherProfile ──▶ Department ──▶ Faculty
│
CourseAssignment
├── Course ──▶ Department
├── Group
├── Teacher (User)
│
ScheduleEntry ──▶ CourseAssignment + Classroom
│
Material ──▶ CourseAssignment
Assignment ──▶ CourseAssignment
├── Submission ──▶ Student (User)
│
Grade ──▶ Student (User) + CourseAssignment
Notification ──▶ User
```

### Опис сутностей

| Сутність | Поля | Опис |
|----------|------|------|
| **User** | id, login, passwordHash, role, email, phone, firstName, lastName, middleName, avatarUrl, status, createdAt | Користувач системи |
| **StudentProfile** | userId, groupId, recordBookNumber, year | Профіль студента |
| **TeacherProfile** | userId, departmentId, position | Профіль викладача |
| **Group** | id, code, specialty, course, curatorTeacherId | Навчальна група |
| **Department** | id, name, facultyId, headUserId | Кафедра |
| **Faculty** | id, name, deanUserId | Факультет |
| **Course** | id, name, code, departmentId, semester, credits | Навчальна дисципліна |
| **CourseAssignment** | id, courseId, groupId, teacherId, academicYear, semester | Призначення дисципліни групі/викладачу |
| **Classroom** | id, building, roomNumber, capacity, type | Аудиторія |
| **ScheduleEntry** | id, courseAssignmentId, classroomId, date, startTime, endTime, type, status | Запис розкладу |
| **Material** | id, courseAssignmentId, title, description, fileLink, publishDate | Навчальний матеріал |
| **Assignment** | id, courseAssignmentId, title, description, dueDate, maxScore | Завдання |
| **Submission** | id, assignmentId, studentId, submittedAt, fileLink, score, comment, status | Здача завдання |
| **Grade** | id, studentId, courseAssignmentId, date, type, value, comment | Оцінка |
| **Notification** | id, userId, type, title, message, createdAt, readFlag | Сповіщення |

---

## 6. Рольова модель (RBAC)

### Ролі та їх права

| Роль | Опис | Основні можливості |
|------|------|--------------------|
| **Студент** | Користувач-студент | Розклад, дисципліни, завдання, оцінки, сповіщення, профіль |
| **Викладач** | Викладач академії | Свої дисципліни/групи, матеріали, завдання, журнал оцінок |
| **Диспетчер розкладу** | Адмін. персонал | CRUD розкладу, перевірка конфліктів, заміни |
| **Завідувач кафедри** | Керівник кафедри | Права викладача + звіти по кафедрі |
| **Декан факультету** | Керівник факультету | Права зав. кафедри + схвалення розкладів, звіти по факультету |
| **Ректор** | Керівник академії | Права декана + звіти по всій академії |
| **Президент академії** | Власник академії | Повний доступ до всієї інформації |
| **Адміністратор** | IT-персонал | Управління користувачами, ролями, довідниками |

### Ієрархія ролей

```
Президент
└── Ректор
    └── Декан
        └── Завідувач кафедри
            └── Викладач

Адміністратор (окрема гілка — керує системою)
Диспетчер (окрема гілка — керує розкладом)
Студент (базовий доступ)
```

---

## 7. API ендпоінти

### Аутентифікація (`/api/auth`)

| Метод | Шлях | Опис | Доступ |
|-------|------|------|--------|
| POST | `/auth/login` | Вхід (логін + пароль → JWT) | Публічний |
| POST | `/auth/refresh` | Оновлення токена | Публічний |
| GET | `/auth/profile` | Поточний профіль | Авторизований |

### Користувачі (`/api/users`)

| Метод | Шлях | Опис | Доступ |
|-------|------|------|--------|
| GET | `/users` | Список користувачів | Адмін, Ректор, Президент |
| GET | `/users/search?q=` | Пошук за ПІБ | Адмін, Президент, Ректор, Декан |
| GET | `/users/:id` | Деталі користувача | Адмін, Президент, Ректор, Декан |
| GET | `/users/group/:groupId` | Студенти групи | Викладач+ |
| GET | `/users/department/:depId` | Викладачі кафедри | Зав. кафедри+ |

### Розклад (`/api/schedule`)

| Метод | Шлях | Опис | Доступ |
|-------|------|------|--------|
| GET | `/schedule` | Весь розклад (+ фільтри) | Авторизований |
| GET | `/schedule/my` | Мій розклад | Авторизований |
| POST | `/schedule` | Створити запис | Диспетчер, Адмін |
| PUT | `/schedule/:id` | Оновити запис | Диспетчер, Адмін |
| DELETE | `/schedule/:id` | Видалити запис | Диспетчер, Адмін |

### Дисципліни (`/api/courses`)

| Метод | Шлях | Опис | Доступ |
|-------|------|------|--------|
| GET | `/courses` | Всі дисципліни | Авторизований |
| GET | `/courses/my` | Мої дисципліни | Авторизований |
| GET | `/courses/:caId/materials` | Матеріали | Авторизований |
| GET | `/courses/:caId/assignments` | Завдання | Авторизований |
| GET | `/courses/:caId/grades` | Журнал оцінок | Викладач+ |
| GET | `/courses/assignments/my` | Мої завдання (студент) | Авторизований |
| GET | `/courses/grades/my` | Мої оцінки (студент) | Авторизований |

### Сповіщення (`/api/notifications`)

| Метод | Шлях | Опис | Доступ |
|-------|------|------|--------|
| GET | `/notifications` | Мої сповіщення | Авторизований |
| GET | `/notifications/unread-count` | Кількість непрочитаних | Авторизований |
| PATCH | `/notifications/:id/read` | Позначити прочитаним | Авторизований |
| PATCH | `/notifications/read-all` | Позначити всі прочитаними | Авторизований |

### Довідники (`/api/references`)

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/references/groups` | Список груп |
| GET | `/references/classrooms` | Список аудиторій |
| GET | `/references/departments` | Список кафедр |
| GET | `/references/faculties` | Список факультетів |

---

## 8. Структура проєкту

```
online_campus/
├── docker-compose.yml
├── README.md
│
├── server/                              # NestJS Backend
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts                      # Точка входу, CORS, global prefix
│       ├── app.module.ts                # Кореневий модуль
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts       # POST login, refresh; GET profile
│       │   ├── auth.service.ts          # JWT логіка, валідація
│       │   ├── jwt.strategy.ts          # Passport JWT стратегія
│       │   ├── jwt-auth.guard.ts        # AuthGuard
│       │   └── roles.guard.ts           # RBAC guard + @Roles() декоратор
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users.controller.ts
│       │   └── users.service.ts
│       ├── schedule/
│       │   ├── schedule.module.ts
│       │   ├── schedule.controller.ts
│       │   └── schedule.service.ts      # CRUD + перевірка конфліктів
│       ├── courses/
│       │   ├── courses.module.ts
│       │   ├── courses.controller.ts
│       │   └── courses.service.ts       # Дисципліни, матеріали, завдання, оцінки
│       ├── references/
│       │   ├── references.module.ts
│       │   ├── references.controller.ts
│       │   └── references.service.ts
│       ├── notifications/
│       │   ├── notifications.module.ts
│       │   ├── notifications.controller.ts
│       │   └── notifications.service.ts
│       └── common/
│           ├── types/
│           │   ├── roles.enum.ts        # Role enum + ROLE_HIERARCHY
│           │   └── entities.ts          # Інтерфейси всіх 15 сутностей
│           └── mock-data/
│               └── index.ts             # Тестові дані
│
└── client/                              # React Frontend
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.ts                   # Proxy /api → server:3000
    └── src/
        ├── main.tsx
        ├── index.css                    # Tailwind CSS
        ├── App.tsx                      # React Router
        ├── types/
        │   └── index.ts                 # Role enum, User, ScheduleEntry, etc.
        ├── services/
        │   └── api.ts                   # Axios instance + JWT interceptors
        ├── store/
        │   └── authStore.ts             # Zustand auth state
        ├── components/
        │   ├── Layout.tsx               # Sidebar + header + role-based nav
        │   └── ProtectedRoute.tsx       # Route guard
        └── pages/
            ├── LoginPage.tsx            # Вхід + тестові акаунти
            ├── DashboardPage.tsx        # Профіль, розклад дня, сповіщення
            ├── SchedulePage.tsx         # Розклад (день/тиждень)
            ├── CoursesPage.tsx          # Мої дисципліни
            ├── AssignmentsPage.tsx      # Завдання студента
            ├── GradesPage.tsx           # Оцінки студента
            ├── NotificationsPage.tsx    # Сповіщення
            └── UsersPage.tsx            # Управління користувачами
```

---

## 9. Тестові дані

### Користувачі (пароль для всіх: `password123`)

| Логін | Роль | ПІБ |
|-------|------|-----|
| `student1` | Студент | Петренко Олександр Іванович |
| `student2` | Студент | Коваленко Марія Сергіївна |
| `student3` | Студент | Шевченко Андрій |
| `student4` | Студент | Бондаренко Ірина |
| `teacher1` | Викладач | Мельник Віктор Олегович |
| `teacher2` | Викладач | Кравченко Наталія Петрівна |
| `teacher3` | Викладач | Ткаченко Сергій |
| `dispatcher1` | Диспетчер | Савченко Олена |
| `head1` | Зав. кафедри | Григоренко Петро Васильович |
| `head2` | Зав. кафедри | Литвиненко Ганна |
| `dean1` | Декан | Козлов Михайло Андрійович |
| `dean2` | Декан | Іванова Тетяна |
| `rector` | Ректор | Сидоренко Володимир Миколайович |
| `president` | Президент | Головко Юрій Борисович |
| `admin` | Адміністратор | Системний Адмін |

### Навчальні групи

| Код | Спеціальність | Курс |
|-----|---------------|------|
| КН-11 | Комп'ютерні науки | 1 |
| ПІ-21 | Програмна інженерія | 2 |
| КН-31 | Комп'ютерні науки | 3 |

### Дисципліни

| Код | Назва | Кредити |
|-----|-------|---------|
| CS101 | Основи програмування | 5 |
| CS201 | Бази даних | 4 |
| SE301 | Веб-технології | 4 |
| CS102 | Алгоритми та структури даних | 5 |
| CS202 | Операційні системи | 3 |

---

## 10. Запуск

### Docker (рекомендовано)

```bash
docker compose up --build
```

Після запуску:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api

### Локально (без Docker)

```bash
# Термінал 1 — бекенд
cd server
npm install
npm run start:dev

# Термінал 2 — фронтенд
cd client
npm install
npm run dev
```

---

## 11. Процес розробки

### Крок 1: Аналіз ТЗ

Проаналізовано технічне завдання «Електронний кампус МАУП» (файл `ТЗ Кампус МАУП.docx`), що містить:
- Опис системи та її призначення
- 8 ролей користувачів з ієрархією доступу
- 47 функціональних вимог (FR-1 — FR-47)
- 11 нефункціональних вимог (NFR-1 — NFR-11)
- Модель даних з 13 сутностей
- Опис 10 модулів системи

### Крок 2: Вибір технологій

| Рішення | Вибір | Обґрунтування |
|---------|-------|---------------|
| Мова | TypeScript | Безпека типів для великого проєкту з RBAC |
| Backend framework | NestJS | Модульна архітектура, вбудований DI, guards |
| Frontend framework | React + Vite | Швидка збірка, великий ecosystem |
| State management | Zustand | Легкий, простий API, без boilerplate |
| CSS | Tailwind CSS | Утилітарний підхід, швидка стилізація |
| Підхід | MVP поетапно | Спочатку базовий функціонал, далі розширення |

### Крок 3: Реалізація бекенду

1. Ініціалізація NestJS проєкту
2. Створення типів (`roles.enum.ts`, `entities.ts`)
3. Генерація тестових даних для всіх 15 сутностей
4. Реалізація Auth модуля (JWT + Passport + RBAC guards)
5. Реалізація бізнес-модулів (Users, Schedule, Courses, References, Notifications)
6. Налаштування CORS та глобального префіксу `/api`

### Крок 4: Реалізація фронтенду

1. Ініціалізація React + Vite + TypeScript
2. Налаштування Tailwind CSS та proxy на бекенд
3. Створення API-сервісу з JWT interceptors (auto-refresh)
4. Zustand store для аутентифікації
5. Layout з sidebar та навігацією за роллю
6. 8 сторінок: Login, Dashboard, Schedule, Courses, Assignments, Grades, Notifications, Users

### Крок 5: Docker

1. Dockerfile для NestJS (Node 20 Alpine)
2. Dockerfile для React (Node 20 build → Nginx serve)
3. docker-compose.yml для оркестрації

---

## 12. Ліцензія

Навчальний проєкт. МАУП, 2025.
