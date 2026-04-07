# Електронний Кампус МАУП — Технічна документація

> Версія документа: 3.0
> Статус: актуальний

---

## Зміст

1. [Огляд проєкту](#1-огляд-проєкту)
2. [Архітектура системи](#2-архітектура-системи)
3. [Технологічний стек](#3-технологічний-стек)
4. [Модулі бекенду](#4-модулі-бекенду)
5. [Компоненти фронтенду](#5-компоненти-фронтенду)
6. [Модель даних](#6-модель-даних)
7. [API — повний опис ендпоінтів](#7-api--повний-опис-ендпоінтів)
8. [Рольова модель доступу (RBAC)](#8-рольова-модель-доступу-rbac)
9. [Безпека](#9-безпека)
10. [Принципи розширюваності](#10-принципи-розширюваності)
11. [Фази розробки](#11-фази-розробки)
12. [Структура проєкту](#12-структура-проєкту)
13. [Запуск та розгортання](#13-запуск-та-розгортання)
14. [CI/CD](#14-cicd)
15. [Тестові дані](#15-тестові-дані)

---

## 1. Огляд проєкту

**Електронний кампус МАУП** — самостійна корпоративна веб-платформа Міжрегіональної Академії Управління Персоналом (МАУП), що об'єднує всіх учасників навчального процесу в єдиному інтерфейсі.

### Призначення

Система є **повністю автономною** — не залежить від жодних зовнішніх університетських систем і керує всіма даними самостійно: курсами, оцінками, розкладом, опитуваннями тощо.

```
┌─────────────────────────────────────────────────────────┐
│              Студенти / Викладачі / Адміністрація        │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS / REST API
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Кампус — єдина система                │
│  Auth · Users · Schedule · Courses · Surveys            │
│  Notifications · AuditLog · References                  │
│                 Власна БД (MongoDB)                      │
└─────────────────────────────────────────────────────────┘
```

### Ключові можливості

- Особисті кабінети для **8 ролей** з різними наборами функцій
- Перегляд розкладу (день / тиждень / місяць) з перевіркою конфліктів
- Управління навчальними матеріалами, завданнями та оцінками
- **Система опитувань студентів** — створення, проходження, аналіз результатів
- Система сповіщень: зміни розкладу, нові завдання, оголошення
- Повний RBAC з ієрархією ролей та аудит-логом дій

---

## 2. Архітектура системи

### Загальна схема

```
┌─────────────────────────────────────────────────────────┐
│                    КЛІЄНТ (браузер)                      │
│   React 19 + Vite + TypeScript + Tailwind CSS + Zustand  │
│   Port: 5173 (dev) / 80 (prod via Nginx)                 │
└──────────────────────────┬──────────────────────────────┘
                           │  HTTPS / REST API
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   БЕКЕНД (NestJS)                        │
│   Port: 3000 | Global prefix: /api                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              CORE MODULES                         │   │
│  │  AuthModule · UsersModule · ScheduleModule        │   │
│  │  CoursesModule · SurveysModule                    │   │
│  │  NotificationsModule · ReferencesModule           │   │
│  │  AuditLogModule                                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                 DATA LAYER                        │   │
│  │  In-Memory Mock → MongoDB (Prisma) [Phase 2]      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Шари застосунку

| Шар | Відповідальність |
|-----|-----------------|
| **Presentation** | React-компоненти, сторінки, форми |
| **State** | Zustand stores: auth, notifications |
| **API Client** | Axios-інстанс з JWT interceptors (auto-refresh) |
| **Controller** | NestJS controllers — прийом HTTP-запитів, валідація DTO |
| **Service** | Бізнес-логіка, оркестрація модулів |
| **Data** | Репозиторії / mock-дані / Prisma ORM |

---

## 3. Технологічний стек

### Бекенд

| Технологія | Версія | Призначення |
|-----------|--------|-------------|
| Node.js | 20 LTS | Runtime |
| NestJS | 10 | Framework (модулі, DI, guards, pipes) |
| TypeScript | 5 | Типізація |
| Passport.js | — | Стратегія JWT-аутентифікації |
| `@nestjs/jwt` | — | JWT access/refresh tokens |
| bcryptjs | — | Хешування паролів |
| class-validator | — | Валідація DTO |
| Helmet | — | HTTP security headers |
| Prisma | — | ORM для MongoDB [Phase 2] |
| MongoDB | 7 | База даних [Phase 2] |

### Фронтенд

| Технологія | Версія | Призначення |
|-----------|--------|-------------|
| React | 19 | UI framework |
| TypeScript | 5 | Типізація |
| Vite | 5 | Bundler / dev-сервер |
| Tailwind CSS | 4 | Утилітарні стилі |
| Zustand | 4 | State management (auth, UI state) |
| Axios | — | HTTP-клієнт з interceptors |
| React Router | 6 | Клієнтський роутинг |

### Інфраструктура

| Технологія | Призначення |
|-----------|-------------|
| Docker | Контейнеризація |
| Docker Compose | Оркестрація dev-середовища |
| Nginx | Веб-сервер для prod (серверинг SPA + reverse proxy) |
| GitHub Actions | CI/CD pipeline |

---

## 4. Модулі бекенду

### 4.1 AuthModule

**Файли:** `src/auth/`

**Відповідальність:** аутентифікація, видача та оновлення JWT-токенів, перевірка статусу акаунту.

**Компоненти:**

| Файл | Опис |
|------|------|
| `auth.controller.ts` | HTTP-ендпоінти: POST /login, POST /refresh, GET /profile |
| `auth.service.ts` | Валідація пароля (bcrypt), генерація access/refresh токенів |
| `jwt.strategy.ts` | Passport JWT стратегія — декодує токен, додає user до request |
| `jwt-auth.guard.ts` | Guard — перевіряє наявність та валідність access token |
| `roles.guard.ts` | Guard — перевіряє ролі за декоратором `@Roles()` з урахуванням ієрархії |

**Логіка токенів:**
- `accessToken` — дія 15 хв (налаштовується через env)
- `refreshToken` — дія 7 днів
- Payload: `{ sub: userId, login, role }`
- При невірних даних — відповідь без деталей
- Заблокований акаунт — відмова до перевірки пароля

---

### 4.2 UsersModule

**Файли:** `src/users/`

**Відповідальність:** управління обліковими записами, пошук, фільтрація за роллю, перегляд профілів.

**Ендпоінти та доступ:**

| Метод | Шлях | Доступ |
|-------|------|--------|
| GET | `/users` | admin, rector, president |
| GET | `/users/search?q=&role=` | admin, rector, president, dean |
| GET | `/users/:id` | admin, rector, president, dean |
| GET | `/users/group/:groupId` | teacher+ |
| GET | `/users/department/:depId` | department_head+ |
| POST | `/users` | admin |
| PATCH | `/users/:id` | admin (часткове оновлення) |
| PATCH | `/users/:id/block` | admin |
| PATCH | `/users/:id/role` | admin |

---

### 4.3 ScheduleModule

**Файли:** `src/schedule/`

**Відповідальність:** зберігання та відображення розкладу; перевірка конфліктів (накладання по викладачу, аудиторії, групі); позначення замін, скасувань, перенесень.

**Ендпоінти та доступ:**

| Метод | Шлях | Доступ |
|-------|------|--------|
| GET | `/schedule` | всі авторизовані |
| GET | `/schedule/my` | всі авторизовані (особистий розклад) |
| GET | `/schedule/group/:groupId` | teacher+ |
| GET | `/schedule/teacher/:teacherId` | dispatcher+ |
| GET | `/schedule/classroom/:classroomId` | dispatcher+ |
| POST | `/schedule` | dispatcher, admin |
| PUT | `/schedule/:id` | dispatcher, admin |
| DELETE | `/schedule/:id` | dispatcher, admin |
| POST | `/schedule/:id/cancel` | dispatcher, admin (+ авто-сповіщення) |
| POST | `/schedule/:id/reschedule` | dispatcher, admin (+ авто-сповіщення) |
| GET | `/schedule/export?format=csv` | dispatcher+ |

**Перевірка конфліктів:** при POST/PUT перевіряє зайнятість викладача, аудиторії, групи. Повертає HTTP 409 з переліком конфліктів.

---

### 4.4 CoursesModule

**Файли:** `src/courses/`

**Відповідальність:** дисципліни, матеріали, завдання, здачі, оцінки — повністю власні, без зовнішніх інтеграцій.

**Ендпоінти та доступ:**

| Метод | Шлях | Доступ |
|-------|------|--------|
| GET | `/courses` | всі авторизовані |
| GET | `/courses/my` | student (свій семестр), teacher (закріплені дисципліни) |
| GET | `/courses/:caId` | авторизовані (деталі призначення) |
| GET | `/courses/:caId/materials` | авторизовані |
| POST | `/courses/:caId/materials` | teacher+ |
| PUT | `/courses/:caId/materials/:id` | teacher+ |
| DELETE | `/courses/:caId/materials/:id` | teacher+ |
| GET | `/courses/:caId/assignments` | авторизовані |
| POST | `/courses/:caId/assignments` | teacher+ |
| PUT | `/courses/:caId/assignments/:id` | teacher+ |
| GET | `/courses/:caId/grades` | teacher+, department_head+ |
| GET | `/courses/assignments/my` | student |
| GET | `/courses/grades/my` | student |
| POST | `/courses/assignments/:id/submit` | student |
| POST | `/courses/assignments/:id/grade` | teacher |

---

### 4.5 SurveysModule *(нове)*

**Файли:** `src/surveys/`

**Відповідальність:** створення опитувань, проходження студентами, перегляд результатів. Опитування можуть бути спрямовані на конкретні групи, курс або всіх студентів.

**Сутності:**

```typescript
interface Survey {
  id: string;
  title: string;
  description?: string;
  createdByUserId: string;
  targetAudience: 'all_students' | 'group' | 'course_year';
  targetGroupIds?: string[];      // якщо targetAudience = 'group'
  targetCourseYear?: number;      // якщо targetAudience = 'course_year'
  status: 'draft' | 'active' | 'closed';
  isAnonymous: boolean;           // якщо true — відповіді без userId
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

interface SurveyQuestion {
  id: string;
  surveyId: string;
  order: number;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'rating';
  required: boolean;
  options?: { id: string; text: string }[];  // для single/multiple_choice
  ratingMax?: number;                        // для rating (напр. 5 або 10)
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string | null;    // null якщо isAnonymous
  submittedAt: string;
  answers: {
    questionId: string;
    value: string | string[];  // string[] для multiple_choice
  }[];
}
```

**Ендпоінти:**

| Метод | Шлях | Доступ | Опис |
|-------|------|--------|------|
| POST | `/surveys` | admin, dean, rector | Створити опитування |
| GET | `/surveys` | admin, dean, rector | Список всіх опитувань |
| GET | `/surveys/active` | student, teacher | Активні опитування для поточного користувача |
| GET | `/surveys/:id` | авторизовані | Деталі опитування з питаннями |
| PUT | `/surveys/:id` | admin, dean (автор) | Редагування (тільки в статусі draft) |
| PATCH | `/surveys/:id/publish` | admin, dean (автор) | Публікація (draft → active) |
| PATCH | `/surveys/:id/close` | admin, dean (автор) | Закрити опитування (active → closed) |
| DELETE | `/surveys/:id` | admin | Видалити (тільки draft) |
| POST | `/surveys/:id/respond` | student, teacher | Надіслати відповіді |
| GET | `/surveys/:id/my-response` | student, teacher | Перевірити — чи вже пройшов |
| GET | `/surveys/:id/results` | admin, dean+, rector, president | Агреговані результати |
| GET | `/surveys/:id/results/export` | admin, dean+ | Вивантаження у CSV |

**Логіка:**
- Студент може проходити опитування **лише один раз**
- При `isAnonymous: true` — userId не зберігається у відповіді, але факт проходження фіксується окремо (щоб не дати пройти двічі)
- Опитування з `endDate` у минулому автоматично переводяться в статус `closed` (cron або перевірка при запиті)
- Результати показують: кількість відповідей на кожен варіант, середнє для rating, текстові відповіді списком

---

### 4.6 ReferencesModule

**Файли:** `src/references/`

**Відповідальність:** довідники системи — групи, аудиторії, кафедри, факультети, спеціальності. Тільки читання для більшості; CRUD для адміністратора.

**Ендпоінти:**

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/references/groups` | Список груп (+ фільтр по факультету/курсу) |
| GET | `/references/groups/:id` | Деталі групи |
| GET | `/references/classrooms` | Список аудиторій (+ фільтр по типу, корпусу) |
| GET | `/references/departments` | Список кафедр |
| GET | `/references/departments/:id` | Деталі кафедри |
| GET | `/references/faculties` | Список факультетів |
| GET | `/references/specialties` | Список спеціальностей |
| POST/PUT/DELETE | `/references/*` | admin |

---

### 4.7 NotificationsModule

**Файли:** `src/notifications/`

**Відповідальність:** генерація, зберігання та доставка сповіщень для конкретних користувачів або груп.

**Ендпоінти:**

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/notifications` | Мої сповіщення (з пагінацією) |
| GET | `/notifications/unread-count` | Кількість непрочитаних |
| PATCH | `/notifications/:id/read` | Позначити прочитаним |
| PATCH | `/notifications/read-all` | Позначити всі прочитаними |
| POST | `/notifications/broadcast` | admin — надіслати всім або групі |

**Типи сповіщень:**

| Тип | Коли генерується |
|-----|-----------------|
| `schedule_change` | Зміна / скасування / перенесення заняття |
| `new_assignment` | Викладач опублікував нове завдання |
| `grade` | Виставлено нову оцінку студенту |
| `new_survey` | Опубліковано нове опитування |
| `announcement` | Адмін надіслав оголошення |
| `system` | Технічні повідомлення |

---

### 4.8 AuditLogModule

**Файли:** `src/audit-log/`

**Відповідальність:** ведення журналу всіх значущих дій. Необхідний для безпеки та розслідування інцидентів.

**Що логується:**
- Всі входи (успішні та невдалі) з IP та user-agent
- Зміни ролей та блокування акаунтів
- CRUD-операції над розкладом
- Виставлення та редагування оцінок
- Публікація та закриття опитувань
- Завантаження файлів

**Структура запису:**
```typescript
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string | null;
  userLogin: string;
  userRole: Role;
  action: string;           // 'login', 'grade.create', 'schedule.delete', 'survey.publish'...
  targetEntity?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
}
```

---

## 5. Компоненти фронтенду

### 5.1 Загальна структура

```
src/
├── App.tsx                  ← роутер, ProtectedRoute
├── main.tsx
├── index.css                ← Tailwind base styles
├── types/index.ts           ← всі TS-інтерфейси
├── services/
│   └── api.ts               ← Axios instance, JWT interceptors, auto-refresh
├── store/
│   ├── authStore.ts         ← Zustand: user, token, login/logout
│   └── notificationsStore.ts
├── components/
│   ├── Layout.tsx           ← sidebar + header + role-based nav
│   ├── ProtectedRoute.tsx   ← route guard
│   ├── RoleBadge.tsx
│   └── NotificationBell.tsx
└── pages/
    ├── LoginPage.tsx
    ├── DashboardPage.tsx
    ├── SchedulePage.tsx
    ├── ScheduleAdminPage.tsx ← [dispatcher, admin]
    ├── CoursesPage.tsx
    ├── CourseDetailPage.tsx
    ├── AssignmentsPage.tsx
    ├── GradesPage.tsx
    ├── SurveysPage.tsx       ← список активних опитувань [student, teacher]
    ├── SurveyPlayerPage.tsx  ← проходження опитування
    ├── SurveyAdminPage.tsx   ← створення/керування [admin, dean]
    ├── SurveyResultsPage.tsx ← результати [admin, dean+]
    ├── NotificationsPage.tsx
    ├── UsersPage.tsx         ← [admin]
    └── ReportsPage.tsx       ← [department_head+]
```

---

### 5.2 Layout — видимість меню за роллю

| Пункт | student | teacher | dispatcher | dept_head | dean | admin |
|-------|---------|---------|------------|-----------|------|-------|
| Дашборд | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Розклад | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Мої курси | ✅ | ✅ | — | — | — | — |
| Завдання | ✅ | ✅ | — | — | — | — |
| Оцінки | ✅ | — | — | — | — | — |
| Опитування | ✅ | ✅ | — | — | — | — |
| Керування опитуваннями | — | — | — | — | ✅ | ✅ |
| Результати опитувань | — | — | — | ✅ | ✅ | ✅ |
| Сповіщення | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Звіти | — | — | — | ✅ | ✅ | — |
| Розклад (CRUD) | — | — | ✅ | — | — | ✅ |
| Користувачі | — | — | — | — | — | ✅ |

---

### 5.3 Сторінки опитувань

#### SurveysPage *(student, teacher)*
- Список активних опитувань для поточного користувача
- Відображення: назва, дедлайн, кількість питань, статус "пройдено / ще ні"
- Кнопка "Пройти" для непройдених

#### SurveyPlayerPage
- Покрокове або все-на-одній-сторінці проходження
- Типи питань: single-choice (radio), multiple-choice (checkbox), text (textarea), rating (зірки / число)
- Прогрес-бар
- Підтвердження перед відправкою
- Після здачі — сторінка подяки

#### SurveyAdminPage *(admin, dean)*
- Таблиця всіх опитувань з фільтром по статусу
- Форма створення: назва, опис, цільова аудиторія, анонімність, терміни
- Конструктор питань: drag & drop порядок, додати/видалити питання, вибір типу
- Кнопки: Зберегти чернетку / Опублікувати / Закрити

#### SurveyResultsPage *(admin, dean+)*
- Загальна статистика: кількість отримала / кількість пройшла / відсоток охоплення
- По кожному питанню:
  - single/multiple_choice: горизонтальна гістограма з кількістю та відсотком
  - rating: середнє значення + розподіл
  - text: список відповідей із пагінацією
- Кнопка "Вивантажити CSV"

---

## 6. Модель даних

### 6.1 Власна БД кампусу

```
User
├── id, login, passwordHash, role, email, phone
├── firstName, lastName, middleName
├── avatarUrl, status: active|blocked, createdAt
│
├── StudentProfile
│   └── userId, groupId, recordBookNumber, year
│
└── TeacherProfile
    └── userId, departmentId, position

Group
└── id, code, specialty, course, curatorTeacherId

Faculty
└── id, name, deanUserId

Department
└── id, name, facultyId, headUserId

Course
└── id, name, code, departmentId, semester, credits

CourseAssignment
└── id, courseId, groupId, teacherId, academicYear, semester

Classroom
└── id, building, roomNumber, capacity, type: lecture|lab|seminar|online

ScheduleEntry
└── id, courseAssignmentId, classroomId, date, startTime, endTime
    type: lecture|seminar|lab|exam|consultation
    status: scheduled|cancelled|rescheduled

Material
└── id, courseAssignmentId, title, description, fileLink, publishDate

Assignment
└── id, courseAssignmentId, title, description, dueDate, maxScore

Submission
└── id, assignmentId, studentId, submittedAt, fileLink
    score, comment, status: submitted|graded|returned

Grade
└── id, studentId, courseAssignmentId, date
    type: current|module|exam|final, value, comment

Survey
└── id, title, description, createdByUserId
    targetAudience: all_students|group|course_year
    targetGroupIds[], targetCourseYear
    status: draft|active|closed
    isAnonymous, startDate, endDate, createdAt

SurveyQuestion
└── id, surveyId, order, text
    type: single_choice|multiple_choice|text|rating
    required, options: [{id, text}], ratingMax

SurveyResponse
└── id, surveyId, userId (null if anonymous), submittedAt
    answers: [{questionId, value: string|string[]}]

SurveyCompletion             ← окремо від response, для анонімних
└── id, surveyId, userId, completedAt

Notification
└── id, userId, type, title, message, createdAt, readFlag

AuditLogEntry
└── id, timestamp, userId, userLogin, userRole, action
    targetEntity, targetId, details, ipAddress, userAgent, result
```

---

## 7. API — повний опис ендпоінтів

Всі ендпоінти доступні за префіксом `/api`. Всі захищені JwtAuthGuard, крім `/api/auth/login` та `/api/auth/refresh`.

### Аутентифікація `/api/auth`

| Метод | Шлях | Тіло | Відповідь | Доступ |
|-------|------|------|-----------|--------|
| POST | `/auth/login` | `{ login, password }` | `{ accessToken, refreshToken, user }` | Публічний |
| POST | `/auth/refresh` | `{ refreshToken }` | `{ accessToken, refreshToken }` | Публічний |
| GET | `/auth/profile` | — | User з профілями | Авторизований |
| POST | `/auth/change-password` | `{ oldPassword, newPassword }` | 200 | Авторизований |

### Користувачі `/api/users`

| Метод | Шлях | Доступ |
|-------|------|--------|
| GET | `/users` | admin, rector, president |
| GET | `/users/search?q=&role=` | admin+ |
| GET | `/users/:id` | admin, rector, president, dean |
| POST | `/users` | admin |
| PATCH | `/users/:id` | admin |
| PATCH | `/users/:id/block` | admin |
| PATCH | `/users/:id/role` | admin |
| GET | `/users/group/:groupId` | teacher+ |
| GET | `/users/department/:depId` | department_head+ |

### Розклад `/api/schedule`

| Метод | Шлях | Доступ |
|-------|------|--------|
| GET | `/schedule/my` | Авторизований |
| GET | `/schedule?date=&groupId=&teacherId=` | Авторизований |
| POST | `/schedule` | dispatcher, admin |
| PUT | `/schedule/:id` | dispatcher, admin |
| DELETE | `/schedule/:id` | dispatcher, admin |
| POST | `/schedule/:id/cancel` | dispatcher, admin |
| GET | `/schedule/export?format=csv&groupId=` | dispatcher+ |

### Курси та навчання `/api/courses`

| Метод | Шлях | Доступ |
|-------|------|--------|
| GET | `/courses/my` | Авторизований |
| GET | `/courses/:caId/materials` | Авторизований |
| POST | `/courses/:caId/materials` | teacher+ |
| GET | `/courses/:caId/assignments` | Авторизований |
| POST | `/courses/:caId/assignments` | teacher+ |
| GET | `/courses/assignments/my` | student |
| POST | `/courses/assignments/:id/submit` | student |
| GET | `/courses/grades/my` | student |
| POST | `/courses/assignments/:id/grade` | teacher |

### Опитування `/api/surveys`

| Метод | Шлях | Доступ |
|-------|------|--------|
| POST | `/surveys` | admin, dean, rector |
| GET | `/surveys` | admin, dean, rector |
| GET | `/surveys/active` | student, teacher |
| GET | `/surveys/:id` | Авторизований |
| PUT | `/surveys/:id` | admin, dean (тільки draft) |
| PATCH | `/surveys/:id/publish` | admin, dean |
| PATCH | `/surveys/:id/close` | admin, dean |
| DELETE | `/surveys/:id` | admin (тільки draft) |
| POST | `/surveys/:id/respond` | student, teacher |
| GET | `/surveys/:id/my-response` | student, teacher |
| GET | `/surveys/:id/results` | admin, dean+, rector, president |
| GET | `/surveys/:id/results/export` | admin, dean+ |

### Сповіщення `/api/notifications`

| Метод | Шлях | Доступ |
|-------|------|--------|
| GET | `/notifications` | Авторизований |
| GET | `/notifications/unread-count` | Авторизований |
| PATCH | `/notifications/:id/read` | Авторизований |
| PATCH | `/notifications/read-all` | Авторизований |
| POST | `/notifications/broadcast` | admin |

### Довідники `/api/references`

| Метод | Шлях | Доступ |
|-------|------|--------|
| GET | `/references/groups` | Авторизований |
| GET | `/references/classrooms` | Авторизований |
| GET | `/references/departments` | Авторизований |
| GET | `/references/faculties` | Авторизований |
| POST/PUT/DELETE | `/references/*` | admin |

---

## 8. Рольова модель доступу (RBAC)

### Ієрархія ролей

```
President
└── Rector
    └── Dean
        └── DepartmentHead
            └── Teacher

Admin          (окрема гілка — системне адміністрування)
Dispatcher     (окрема гілка — управління розкладом)
Student        (базовий доступ)
```

Права успадковуються вниз по ієрархії: ректор бачить усе, що бачить декан.

### Матриця можливостей

| Можливість | student | teacher | dispatcher | dept_head | dean | rector | president | admin |
|------------|---------|---------|------------|-----------|------|--------|-----------|-------|
| Особистий розклад | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Редагування розкладу | — | — | ✅ | — | — | — | — | ✅ |
| Перегляд матеріалів курсів | ✅ | ✅ | — | ✅ | — | — | — | — |
| Публікація матеріалів | — | ✅ | — | ✅ | — | — | — | — |
| Здача завдань | ✅ | — | — | — | — | — | — | — |
| Виставлення оцінок | — | ✅ | — | ✅ | — | — | — | — |
| Перегляд особистих оцінок | ✅ | — | — | — | — | — | — | — |
| Проходження опитувань | ✅ | ✅ | — | — | — | — | — | — |
| Створення опитувань | — | — | — | — | ✅ | ✅ | ✅ | ✅ |
| Перегляд результатів опитувань | — | — | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| Звіти по кафедрі | — | — | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| Управління користувачами | — | — | — | — | — | — | — | ✅ |
| Перегляд аудит-логу | — | — | — | — | — | — | — | ✅ |

---

## 9. Безпека

### Аутентифікація та токени

- **bcrypt** (cost factor 12) для хешування паролів
- **Access token** — короткоживучий (15 хв), мінімізує вікно компрометації
- **Refresh token** — зберігається в `httpOnly cookie` або захищеному localStorage

### HTTP-безпека

- **HTTPS** обов'язково в production
- **Helmet** — заголовки: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`
- **CORS** — дозволений тільки домен фронтенду
- **Rate limiting** — `/auth/login` максимум 10 спроб за 15 хвилин з одного IP
- **Input validation** — `class-validator` + `ValidationPipe` на всіх DTO

### Захист від типових вразливостей

| Вразливість | Захист |
|-------------|--------|
| SQL Injection | Parameterized queries через Prisma ORM |
| XSS | `Content-Security-Policy`, React escaping |
| CSRF | `SameSite=Strict` cookie, CORS обмеження |
| Brute Force | Rate limiting на /auth/login |
| Path Traversal | Валідація file paths, заборона `../` |
| Sensitive Data Exposure | Пароль ніколи не повертається в API-відповідях |

---

## 10. Принципи розширюваності

### Нові ролі

1. Додати значення до `Role` enum
2. Оновити `ROLE_HIERARCHY`
3. Додати `ROLE_LABELS` на фронтенді
4. Оновити `Layout.tsx` — пункти меню для нової ролі
5. Додати `@Roles()` декоратори на потрібних ендпоінтах

### База даних

- Phase 1: In-memory mock data
- Phase 2: MongoDB через Prisma (одна зміна в data layer, бізнес-логіка не змінюється)

### Нові типи сповіщень

Додати значення до `NotificationType` union та обробник у `NotificationsService.notify()`.

---

## 11. Фази розробки

### Фаза 1 — MVP (поточний стан)

| # | Компонент | Статус |
|---|-----------|--------|
| 1 | NestJS + TypeScript ініціалізація | ✅ Готово |
| 2 | Моделі даних та типи | ✅ Готово |
| 3 | Mock-дані (15 користувачів, всі 8 ролей) | ✅ Готово |
| 4 | AuthModule (JWT, bcrypt, refresh) | ✅ Готово |
| 5 | RBAC Guards (@Roles, RolesGuard) | ✅ Готово |
| 6 | ScheduleModule (CRUD, перевірка конфліктів) | ✅ Готово |
| 7 | CoursesModule (дисципліни, матеріали, завдання) | ✅ Готово |
| 8 | ReferencesModule (довідники) | ✅ Готово |
| 9 | NotificationsModule | ✅ Готово |
| 10 | UsersModule | ✅ Готово |
| 11 | React: Auth flow (Zustand, interceptors) | ✅ Готово |
| 12 | React: Layout з роль-навігацією | ✅ Готово |
| 13 | React: 8 сторінок | ✅ Готово |
| 14 | Docker Compose | ✅ Готово |

### Фаза 2 — База даних + File Upload + Опитування

| # | Завдання |
|---|----------|
| 1 | MongoDB + Prisma ORM замість mock-даних |
| 2 | Міграції схеми |
| 3 | FileModule — завантаження файлів (матеріали, здачі) |
| 4 | CRUD для всіх довідників через UI |
| 5 | **SurveysModule** — бекенд + фронтенд (повний цикл) |
| 6 | Модуль відвідуваності |

### Фаза 3 — Production Ready

| # | Завдання |
|---|----------|
| 1 | HTTPS + Helmet + rate limiting |
| 2 | CI/CD pipeline (GitHub Actions → VPS) |
| 3 | Email-сповіщення (зміни розкладу, нові завдання) |
| 4 | AuditLogModule (повна реалізація) |
| 5 | Адаптивний дизайн (мобільні пристрої) |
| 6 | Звіти та експорт (XLS/CSV) |
| 7 | i18n (українська + англійська) |

---

## 12. Структура проєкту

```
online_campus/
├── docker-compose.yml
├── README.md
├── .github/
│   └── workflows/
│       ├── ci.yml             ← lint + test на PR
│       └── deploy.yml         ← деплой на VPS після merge в main
│
├── server/                    # NestJS Backend
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       │
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── jwt.strategy.ts
│       │   ├── jwt-auth.guard.ts
│       │   └── roles.guard.ts
│       │
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users.controller.ts
│       │   └── users.service.ts
│       │
│       ├── schedule/
│       │   ├── schedule.module.ts
│       │   ├── schedule.controller.ts
│       │   └── schedule.service.ts
│       │
│       ├── courses/
│       │   ├── courses.module.ts
│       │   ├── courses.controller.ts
│       │   └── courses.service.ts
│       │
│       ├── surveys/
│       │   ├── surveys.module.ts
│       │   ├── surveys.controller.ts
│       │   └── surveys.service.ts
│       │
│       ├── references/
│       │   ├── references.module.ts
│       │   ├── references.controller.ts
│       │   └── references.service.ts
│       │
│       ├── notifications/
│       │   ├── notifications.module.ts
│       │   ├── notifications.controller.ts
│       │   └── notifications.service.ts
│       │
│       ├── audit-log/
│       │   ├── audit-log.module.ts
│       │   └── audit-log.service.ts
│       │
│       └── common/
│           ├── types/
│           │   ├── roles.enum.ts
│           │   └── entities.ts
│           └── mock-data/
│               └── index.ts
│
└── client/                    # React Frontend
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── index.css
        ├── App.tsx
        ├── types/index.ts
        ├── services/
        │   └── api.ts
        ├── store/
        │   ├── authStore.ts
        │   └── notificationsStore.ts
        ├── components/
        │   ├── Layout.tsx
        │   ├── ProtectedRoute.tsx
        │   ├── RoleBadge.tsx
        │   └── NotificationBell.tsx
        └── pages/
            ├── LoginPage.tsx
            ├── DashboardPage.tsx
            ├── SchedulePage.tsx
            ├── ScheduleAdminPage.tsx
            ├── CoursesPage.tsx
            ├── CourseDetailPage.tsx
            ├── AssignmentsPage.tsx
            ├── GradesPage.tsx
            ├── SurveysPage.tsx
            ├── SurveyPlayerPage.tsx
            ├── SurveyAdminPage.tsx
            ├── SurveyResultsPage.tsx
            ├── NotificationsPage.tsx
            ├── UsersPage.tsx
            └── ReportsPage.tsx
```

---

## 13. Запуск та розгортання

### Docker (рекомендовано для розробки)

```bash
docker compose up --build
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api

### Локально

```bash
# Термінал 1 — бекенд
cd server && npm install && npm run start:dev

# Термінал 2 — фронтенд
cd client && npm install && npm run dev
```

### Змінні середовища (server)

```env
# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# БД [Phase 2]
DATABASE_URL=mongodb://mongo:27017/campus

# Production
PORT=3000
NODE_ENV=production
```

### Production (VPS)

Для 5000 користувачів достатньо одного сервера. Рекомендована конфігурація:

**Hetzner CX31** (або аналог): 4 vCPU, 8 GB RAM, 80 GB SSD — ~€12/міс.

На сервері запускається `docker-compose.prod.yml`:
```yaml
services:
  server:   # NestJS — 2 replicas (через docker compose scale або Traefik)
  client:   # Nginx + React build
  mongo:    # MongoDB 7
  # Traefik або Nginx як reverse proxy з SSL (Let's Encrypt)
```

**Орієнтовна ємність при 5000 юзерів:**
- Пікове одночасне навантаження ~500 активних сесій
- NestJS на Node.js легко тримає 1000+ req/s на CX31
- MongoDB з індексами — без проблем для такого обсягу

---

## 14. CI/CD

### Рекомендована схема

```
Developer → git push → GitHub → GitHub Actions
                                    │
                          ┌─────────┴──────────┐
                          ▼                    ▼
                    PR/branch              merge main
                  [ci.yml]              [deploy.yml]
                lint + test           build → push → SSH deploy
```

### CI workflow (`.github/workflows/ci.yml`)

Запускається на кожен pull request.

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: server/package-lock.json

      - name: Install server deps
        run: npm ci
        working-directory: server

      - name: Lint
        run: npm run lint
        working-directory: server

      - name: Test
        run: npm run test
        working-directory: server

      - name: Build check
        run: npm run build
        working-directory: server
```

### Deploy workflow (`.github/workflows/deploy.yml`)

Запускається після merge у `main`. Будує Docker-образи, пушить до реєстру, деплоїть на VPS через SSH.

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push server image
        uses: docker/build-push-action@v5
        with:
          context: ./server
          push: true
          tags: yourorg/campus-server:${{ github.sha }},yourorg/campus-server:latest

      - name: Build and push client image
        uses: docker/build-push-action@v5
        with:
          context: ./client
          push: true
          tags: yourorg/campus-client:${{ github.sha }},yourorg/campus-client:latest

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/campus
            docker compose pull
            docker compose up -d --remove-orphans
            docker image prune -f
```

### Secrets для GitHub Actions

| Secret | Значення |
|--------|----------|
| `DOCKER_USERNAME` | логін Docker Hub (або GHCR) |
| `DOCKER_PASSWORD` | пароль / токен |
| `VPS_HOST` | IP або домен сервера |
| `VPS_USER` | SSH-користувач (напр. `deploy`) |
| `VPS_SSH_KEY` | приватний SSH-ключ |

### Підготовка VPS

```bash
# 1. Встановити Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 2. Створити директорію проєкту
mkdir -p /opt/campus && cd /opt/campus

# 3. Покласти docker-compose.prod.yml та .env
# (один раз вручну або через ansible/terraform)

# 4. Налаштувати SSL — Nginx + Let's Encrypt (certbot або Traefik)
```

### Альтернатива без VPS

Для швидкого старту або стейджингу:

| Платформа | Плюси | Мінуси |
|-----------|-------|--------|
| **Railway** | Deploy одним кліком, MongoDB включений, SSL автоматично | Дорожче при зростанні трафіку |
| **Render** | Безкоштовний tier, простий деплой з Docker | Cold start на free tier |
| **Fly.io** | Близька до production гнучкість, є Kyiv PoP | Потребує CLI |

---

## 15. Тестові дані

### Користувачі (пароль для всіх: `password123`)

| Логін | Роль | ПІБ |
|-------|------|-----|
| `student1` | Студент | Петренко Олександр Іванович |
| `student2` | Студент | Коваленко Марія Сергіївна |
| `teacher1` | Викладач | Мельник Віктор Олегович |
| `teacher2` | Викладач | Кравченко Наталія Петрівна |
| `dispatcher1` | Диспетчер розкладу | Савченко Олена |
| `head1` | Завідувач кафедри | Григоренко Петро Васильович |
| `dean1` | Декан факультету | Козлов Михайло Андрійович |
| `rector` | Ректор | Сидоренко Володимир Миколайович |
| `president` | Президент академії | Головко Юрій Борисович |
| `admin` | Адміністратор | Системний Адмін |

### Тестові опитування (mock)

| Назва | Статус | Аудиторія | Анонімно |
|-------|--------|-----------|---------|
| "Якість викладання — весна 2026" | active | all_students | так |
| "Оцінка роботи деканату" | active | all_students | так |
| "Побажання щодо розкладу" | draft | — | ні |

---

*Документ актуальний станом на березень 2026.*
