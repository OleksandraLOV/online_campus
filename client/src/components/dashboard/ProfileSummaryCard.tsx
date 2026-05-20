import { useTranslation } from 'react-i18next';
import { ROLE_LABEL_KEYS, type User } from '../../types';

type Props = {
  user: User | null;
};

export default function ProfileSummaryCard({ user }: Props) {
  const { t } = useTranslation();

  const fullName = [user?.lastName, user?.firstName, user?.middleName]
    .filter(Boolean)
    .join(' ');

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`;

  const profileId =
    user?.studentProfile?.recordBookNumber || user?.login || '—';

  const thirdRowValue = user?.studentProfile
    ? `${user.studentProfile.groupId || '—'}${
        user.studentProfile.year ? ` / ${user.studentProfile.year} курс` : ''
      }`
    : user?.teacherProfile?.position || '—';

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-700">
          {initials || 'U'}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            {user ? t(ROLE_LABEL_KEYS[user.role]) : '—'}
          </p>

          <h3 className="mt-2 text-2xl font-bold leading-tight text-slate-900">
            {fullName || '—'}
          </h3>

          <p className="mt-1 text-sm text-slate-400">ID: {profileId}</p>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-4">
        <span className="text-slate-400">{t('dashboard.email')}</span>
        <span className="break-words text-right font-semibold text-slate-900">
          {user?.email || '—'}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-4">
        <span className="text-slate-400">{t('dashboard.phone')}</span>
        <span className="break-words text-right font-semibold text-slate-900">
          {user?.phone || '—'}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-4">
        <span className="text-slate-400">
          {user?.studentProfile
            ? t('dashboard.groupCourse')
            : t('dashboard.position')}
        </span>
        <span className="break-words text-right font-semibold text-slate-900">
          {thirdRowValue}
        </span>
      </div>
    </div>
  );
}
