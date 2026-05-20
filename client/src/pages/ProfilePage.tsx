import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { ROLE_LABEL_KEYS } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-4">
      <span className="font-medium text-gray-700">{label}:</span>

      <span className="min-w-0 break-words text-right text-gray-900">
        {value || '—'}
      </span>
    </div>
  );
}

import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '../schemas/authSchema';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, loadProfile, isAuthenticated } = useAuthStore();
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
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
    <div className="mx-auto w-full max-w-[1320px] space-y-6">
      <section className="relative rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 pr-0 sm:flex-row sm:items-center sm:pr-56">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('profile.title')}
            </h1>

            <p className="mt-1 break-words text-lg text-gray-700">{fullName}</p>

            <p className="mt-1 text-sm text-gray-500">
              {t(ROLE_LABEL_KEYS[user.role])}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPasswordFormOpen((prev) => !prev)}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-blue-600 px-5 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 sm:absolute sm:right-6 sm:top-6 sm:mt-0 sm:w-auto">
          {isPasswordFormOpen
            ? t('profile.hidePasswordForm')
            : t('profile.changePassword')}
        </button>
      </section>

      {isPasswordFormOpen && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            {t('profile.changePassword')}
          </h2>

          {
            <form
              onSubmit={handleSubmit(onChangePassword)}
              className="space-y-4">
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
          }
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            {t('profile.commonInfo')}
          </h2>

          <div className="space-y-3 text-sm">
            <InfoRow label={t('profile.login')} value={user.login} />

            <InfoRow label={t('profile.email')} value={user.email || '—'} />

            <InfoRow label={t('profile.phone')} value={user.phone || '—'} />

            <InfoRow
              label={t('profile.status')}
              value={
                user.status === 'active'
                  ? t('status.active')
                  : t('status.blocked')
              }
            />

            <InfoRow
              label={t('profile.role')}
              value={t(ROLE_LABEL_KEYS[user.role])}
            />
          </div>
        </section>

        {user.studentProfile && (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              {t('profile.studentInfo')}
            </h2>

            <div className="space-y-3 text-sm">
              <InfoRow
                label={t('profile.recordBookNumber')}
                value={user.studentProfile.recordBookNumber || '—'}
              />

              <InfoRow
                label={t('profile.year')}
                value={user.studentProfile.year ?? '—'}
              />

              <InfoRow
                label={t('profile.groupId')}
                value={user.studentProfile.group || '—'}
              />
            </div>
          </section>
        )}

        {user.teacherProfile && (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              {t('profile.teacherInfo')}
            </h2>

            <div className="space-y-3 text-sm">
              <InfoRow
                label={t('profile.position')}
                value={user.teacherProfile.position || '—'}
              />

              <InfoRow
                label={t('profile.departmentId')}
                value={user.teacherProfile.department || '—'}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
