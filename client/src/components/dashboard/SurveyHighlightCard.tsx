import type { NotificationItem } from '../../pages/shared/DashboardPage';
import { useTranslation } from 'react-i18next';

type Props = {
  items: NotificationItem[];
};

function isSurveyItem(item: NotificationItem) {
  const text = `${item.title ?? ''} ${item.message ?? ''}`.toLowerCase();

  return (
    text.includes('опитув') ||
    text.includes('survey') ||
    text.includes('poll') ||
    text.includes('анкета')
  );
}

export default function SurveyHighlightCard({ items }: Props) {
  const surveyItems = items.filter(isSurveyItem).slice(0, 3);
  const { t } = useTranslation();

  return (
    <div className="rounded-[28px] bg-gradient-to-br from-blue-600 to-blue-500 p-6 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
      <h3 className="mb-5 text-2xl font-bold">{t('dashboard.surveysTitle')}</h3>

      {surveyItems.length === 0 ? (
        <p className="text-blue-100">{t('dashboard.noSurveys')}</p>
      ) : (
        <div className="space-y-4">
          {surveyItems.map((item, index) => (
            <div
              key={item.id || `${item.title}-${index}`}
              className="rounded-[22px] bg-white/10 p-4 backdrop-blur">
              <p className="font-semibold text-white">
                {item.title || 'Без назви'}
              </p>
              <p className="mt-1 text-sm text-blue-100">
                {item.message || '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
