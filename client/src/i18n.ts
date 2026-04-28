import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  uk: {
    translation: {
      'app.title': 'Кампус МАУП',
      'app.subtitle': 'Електронний кампус академії',

      'nav.dashboard': 'Дашборд',
      'nav.schedule': 'Розклад',
      'nav.courses': 'Дисципліни',
      'nav.assignments': 'Завдання',
      'nav.grades': 'Оцінки',
      'nav.users': 'Користувачі',
      'nav.notifications': 'Сповіщення',

      'layout.logout': 'Вийти',
      'layout.language': 'Мова',

      'auth.loginLabel': 'Логін',
      'auth.passwordLabel': 'Пароль',
      'auth.loginPlaceholder': 'Введіть логін',
      'auth.passwordPlaceholder': 'Введіть пароль',
      'auth.submit': 'Увійти',
      'auth.loading': 'Вхід...',
      'auth.testAccounts': 'Тестові акаунти (пароль: password123)',

      'roles.student': 'Студент',
      'roles.teacher': 'Викладач',
      'roles.dispatcher': 'Диспетчер',
      'roles.departmentHead': 'Зав. кафедри',
      'roles.dean': 'Декан',
      'roles.rector': 'Ректор',
      'roles.president': 'Президент',
      'roles.admin': 'Адмін',
    },
  },
  en: {
    translation: {
      'app.title': 'MAUP Campus',
      'app.subtitle': 'Academy electronic campus',

      'nav.dashboard': 'Dashboard',
      'nav.schedule': 'Schedule',
      'nav.courses': 'Courses',
      'nav.assignments': 'Assignments',
      'nav.grades': 'Grades',
      'nav.users': 'Users',
      'nav.notifications': 'Notifications',

      'layout.logout': 'Log out',
      'layout.language': 'Language',

      'auth.loginLabel': 'Login',
      'auth.passwordLabel': 'Password',
      'auth.loginPlaceholder': 'Enter login',
      'auth.passwordPlaceholder': 'Enter password',
      'auth.submit': 'Sign in',
      'auth.loading': 'Signing in...',
      'auth.testAccounts': 'Test accounts (password: password123)',

      'roles.student': 'Student',
      'roles.teacher': 'Teacher',
      'roles.dispatcher': 'Dispatcher',
      'roles.departmentHead': 'Department head',
      'roles.dean': 'Dean',
      'roles.rector': 'Rector',
      'roles.president': 'President',
      'roles.admin': 'Admin',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    supportedLngs: ['uk', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;