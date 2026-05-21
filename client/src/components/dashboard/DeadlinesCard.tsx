import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { NotificationItem } from '../../pages/shared/DashboardPage';

type Props = {
  items: NotificationItem[];
};

export default function DeadlinesCard({ items }: Props) {
  const { t } = useTranslation();

  const deadlineItems = useMemo(() => {
    return items.slice(0, 3);
  }, [items]);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">
          {t('dashboard.deadlinesTitle')}
        </h3>
      </div>

      {deadlineItems.length === 0 ? (
        <div className="flex min-h-[140px] items-center rounded-3xl bg-slate-50 px-6 py-5">
          <p className="text-sm leading-6 text-slate-500">
            {t('dashboard.noDeadlines')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {deadlineItems.map((item, index) => (
            <div
              key={`${item.id ?? item.title}-${index}`}
              className="rounded-2xl bg-slate-50 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">
                {item.title || t('dashboard.deadlineFallbackTitle')}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.message || t('dashboard.noExtraInfo')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
