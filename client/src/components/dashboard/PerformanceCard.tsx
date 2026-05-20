import { useTranslation } from 'react-i18next';

import { ROLE_LABEL_KEYS, type User } from '../../types';

type Props = {
  user: User | null;
};

type StatTileProps = {
  label: string;
  value: string;
  large?: boolean;
};

function StatTile({ label, value, large = false }: StatTileProps) {
  return (
    <div className="min-w-0 rounded-[24px] bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
        {label}
      </p>

      <p
        className={
          large
            ? 'mt-3 truncate text-lg font-semibold text-slate-900'
            : 'mt-3 truncate text-sm font-semibold text-slate-900'
        }
        title={value}>
        {value}
      </p>
    </div>
  );
}

export default function PerformanceCard({ user }: Props) {
  const { t } = useTranslation();

  const role = user ? t(ROLE_LABEL_KEYS[user.role]) : '—';

  const status =
    user?.status === 'active'
      ? t('status.active')
      : user?.status === 'blocked'
        ? t('status.blocked')
        : '—';

  const studyOrPosition =
    user?.studentProfile?.year?.toString() ||
    user?.teacherProfile?.position ||
    '—';

  const groupOrDepartment =
    user?.studentProfile?.group || user?.teacherProfile?.department || '—';

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {t('dashboard.profile')}
        </h3>

        <span className="text-slate-300">↗</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatTile label={t('dashboard.role')} value={role} large />
        <StatTile label={t('dashboard.status')} value={status} large />

        <StatTile
          label={
            user?.studentProfile
              ? t('dashboard.studyYear')
              : t('dashboard.position')
          }
          value={studyOrPosition}
        />

        <StatTile
          label={
            user?.studentProfile
              ? t('dashboard.groupId')
              : t('dashboard.departmentId')
          }
          value={groupOrDepartment}
        />
      </div>
    </div>
  );
}
