import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { Role, ROLE_LABEL_KEYS } from '../types';
import NotificationsBell from './notifications/NotificationsBell';
import LanguageSwitcher from './LanguageSwitcher';

const ALL_ROLES = Object.values(Role) as Role[];

const NAV_ITEMS: {
  labelKey: string;
  path: string;
  roles: Role[];
}[] = [
  { labelKey: 'nav.profile', path: '/profile', roles: ALL_ROLES },
  {
    labelKey: 'nav.dashboard',
    path: '/dashboard',
    roles: ALL_ROLES,
  },
  {
    labelKey: 'nav.schedule',
    path: '/schedule',
    roles: ALL_ROLES,
  },
  {
    labelKey: 'nav.courses',
    path: '/courses',
    roles: [Role.STUDENT, Role.TEACHER, Role.DEPARTMENT_HEAD, Role.DEAN],
  },
  {
    labelKey: 'nav.assignments',
    path: '/assignments',
    roles: [Role.STUDENT],
  },
  {
    labelKey: 'nav.grades',
    path: '/grades',
    roles: [Role.STUDENT],
  },
  {
    labelKey: 'nav.users',
    path: '/users',
    roles: [Role.ADMIN, Role.PRESIDENT, Role.RECTOR, Role.DEAN],
  },
];

export default function Layout() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { user, logout, loadProfile, isAuthenticated } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user && isAuthenticated && localStorage.getItem('accessToken')) {
      loadProfile();
    }
  }, [user, isAuthenticated, loadProfile]);

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          w-64 bg-blue-900 text-white
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
        <div className="p-4 border-b border-blue-800">
          <h1 className="text-lg font-bold">{t('app.title')}</h1>

          {user && (
            <p className="mt-1 text-sm text-blue-200">
              {t(ROLE_LABEL_KEYS[user.role])}
            </p>
          )}
        </div>

        <nav className="py-2">
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className="block px-4 py-2.5 text-blue-100 hover:bg-blue-800 transition-colors">
              {t(item.labelKey)}
            </Link>
          ))}

          <Link
            to="/notifications"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-2.5 text-blue-100 hover:bg-blue-800 transition-colors">
            {t('nav.notifications')}
          </Link>
        </nav>
      </aside>

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 border-b bg-white px-4 py-3 shadow-sm sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="text-xl text-gray-700 lg:hidden">
              ☰
            </button>

            <div className="ml-auto flex items-center gap-3 sm:gap-4">
              <LanguageSwitcher />

              {user && (
                <Link
                  to="/profile"
                  className="hidden sm:flex h-14 items-center rounded-full border border-gray-300 px-6 transition hover:bg-gray-50 hover:border-gray-400">
                  <p className="text-sm font-medium text-gray-900">
                    {user.lastName} {user.firstName}
                  </p>
                </Link>
              )}

              <NotificationsBell />

              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700">
                {t('layout.logout')}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
