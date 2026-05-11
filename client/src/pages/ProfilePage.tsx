import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { ROLE_LABEL_KEYS } from '../types';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, loadProfile, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!user && isAuthenticated && localStorage.getItem('accessToken')) {
      loadProfile();
    }
  }, [user, isAuthenticated, loadProfile]);

  if (!user) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-gray-500">{t('profile.loading')}</p>
      </div>
    );
  }

  const fullName = [user.lastName, user.firstName, user.middleName]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('profile.title')}
            </h1>
            <p className="mt-1 text-lg text-gray-700">{fullName}</p>
            <p className="mt-1 text-sm text-gray-500">
              {t(ROLE_LABEL_KEYS[user.role])}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('profile.commonInfo')}
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">
                {t('profile.login')}:
              </span>{' '}
              <span className="text-gray-600">{user.login}</span>
            </div>

            <div>
              <span className="font-medium text-gray-700">
                {t('profile.email')}:
              </span>{' '}
              <span className="text-gray-600">{user.email || '—'}</span>
            </div>

            <div>
              <span className="font-medium text-gray-700">
                {t('profile.phone')}:
              </span>{' '}
              <span className="text-gray-600">{user.phone || '—'}</span>
            </div>

            <div>
              <span className="font-medium text-gray-700">
                {t('profile.status')}:
              </span>{' '}
              <span className="text-gray-600">
                {user.status === 'active'
                  ? t('status.active')
                  : t('status.blocked')}
              </span>
            </div>

            <div>
              <span className="font-medium text-gray-700">
                {t('profile.role')}:
              </span>{' '}
              <span className="text-gray-600">
                {t(ROLE_LABEL_KEYS[user.role])}
              </span>
            </div>
          </div>
        </div>

        {user.studentProfile && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('profile.studentInfo')}
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  {t('profile.recordBookNumber')}:
                </span>{' '}
                <span className="text-gray-600">
                  {user.studentProfile.recordBookNumber || '—'}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-700">
                  {t('profile.year')}:
                </span>{' '}
                <span className="text-gray-600">
                  {user.studentProfile.year ?? '—'}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-700">
                  {t('profile.groupId')}:
                </span>{' '}
                <span className="text-gray-600">
                  {user.studentProfile.groupId || '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        {user.teacherProfile && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('profile.teacherInfo')}
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  {t('profile.position')}:
                </span>{' '}
                <span className="text-gray-600">
                  {user.teacherProfile.position || '—'}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-700">
                  {t('profile.departmentId')}:
                </span>{' '}
                <span className="text-gray-600">
                  {user.teacherProfile.departmentId || '—'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
