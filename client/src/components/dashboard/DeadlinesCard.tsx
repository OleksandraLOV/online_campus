import type { NotificationItem } from '../../pages/shared/DashboardPage';
import { useTranslation } from 'react-i18next';

type Props = {
  items: NotificationItem[];
};

function isDeadlineItem(item: NotificationItem) {
  const text = `${item.title ?? ''} ${item.message ?? ''}`.toLowerCase();

  return (
    text.includes('завдан') ||
    text.includes('дедлайн') ||
    text.includes('курсов') ||
    text.includes('лаб') ||
    text.includes('assignment') ||
    text.includes('deadline')
  );
}

export default function DeadlinesCard({ items }: Props) {
    const { t } = useTranslation();
  const deadlineItems = items.filter(isDeadlineItem).slice(0, 4);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <h3 className="mb-5 text-2xl font-bold text-slate-900">
        {t('dashboard.deadlinesTitle')}
      </h3>

      {deadlineItems.length === 0 ? (
        <div className="flex min-h-[110px] items-center rounded-3xl bg-slate-50 px-6 py-5">
          <p className="text-sm leading-6 text-slate-500">
            {t('dashboard.noDeadlines')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deadlineItems.map((item, index) => (
            <div
              key={item.id || `${item.title}-${index}`}
              className="rounded-[22px] border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">
                {item.title || 'Без назви'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {item.message || '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
