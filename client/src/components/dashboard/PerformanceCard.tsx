import { useTranslation } from 'react-i18next';
import { ROLE_LABEL_KEYS, type User } from '../../types';

type Props = {
  user: User | null;
};

export default function PerformanceCard({ user }: Props) {
  const { t } = useTranslation();

  const role = user ? t(ROLE_LABEL_KEYS[user.role]) : '—';
  const status =
    user?.status === 'active'
      ? t('status.active')
      : user?.status === 'blocked'
        ? t('status.blocked')
        : '—';

  const leftValue =
    user?.studentProfile?.year?.toString() ||
    user?.teacherProfile?.position ||
    '—';

  const rightValue =
    user?.studentProfile?.groupId || user?.teacherProfile?.departmentId || '—';

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">
          {t('dashboard.profile')}
        </h3>
        <span className="text-slate-300">↗</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            {t('dashboard.role')}
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{role}</p>
        </div>

        <div className="rounded-[24px] bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            {t('dashboard.status')}
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{status}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-3">
          <span className="text-slate-400">
            {user?.studentProfile
              ? t('dashboard.studyYear')
              : t('dashboard.position')}
          </span>
          <span className="font-medium text-slate-900">{leftValue}</span>
        </div>

        <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-3">
          <span className="text-slate-400">
            {user?.studentProfile
              ? t('dashboard.groupId')
              : t('dashboard.departmentId')}
          </span>
          <span className="break-words font-medium text-slate-900">
            {rightValue}
          </span>
        </div>
      </div>
    </div>
  );
}
