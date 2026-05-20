import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { ROLE_LABEL_KEYS } from '../types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '../schemas/authSchema';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, loadProfile, isAuthenticated } = useAuthStore();
  const { changePassword } = useAuthStore();

  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onChangePassword = async (values: ChangePasswordFormData) => {
    setPasswordSuccess(null);
    setPasswordError(null);

    try {
      const message = await changePassword(
        values.oldPassword,
        values.newPassword,
      );
      setPasswordSuccess(message);
      reset();
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'Не вдалося змінити пароль',
      );
    }
  };

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
                  {user.studentProfile.group || '—'}
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
                  {user.teacherProfile.department || '—'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Зміна пароля
        </h2>

        <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Поточний пароль
            </label>
            <input
              type="password"
              {...register('oldPassword')}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
            />
            {errors.oldPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Новий пароль
            </label>
            <input
              type="password"
              {...register('newPassword')}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Повторіть новий пароль
            </label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {passwordError && (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
              {passwordError}
            </p>
          )}

          {passwordSuccess && (
            <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
              {passwordSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Зміна пароля...' : 'Змінити пароль'}
          </button>
        </form>
      </div>
    </div>
  );
}
