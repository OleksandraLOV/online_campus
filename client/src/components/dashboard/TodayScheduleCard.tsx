import type { ScheduleItem } from '../../pages/shared/DashboardPage';
import { useTranslation } from 'react-i18next';

type Props = {
  items: ScheduleItem[];
  isLoading: boolean;
};

function getLessonTitle(item: ScheduleItem) {
  return item.title || item.subjectName || item.courseName || 'Заняття';
}

function getLessonMeta(item: ScheduleItem) {
  return [item.lessonType, item.teacherName].filter(Boolean).join(' • ');
}

function getLessonRoom(item: ScheduleItem) {
  return item.classroom || item.classroomName || '—';
}

export default function TodayScheduleCard({ items, isLoading }: Props) {
  const { t } = useTranslation();

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">
          {t('dashboard.todaySchedule')}
        </h3>
        <span className="text-sm font-medium text-blue-600">
          {items.length > 0
            ? t('dashboard.lessonsCount', { count: items.length })
            : t('dashboard.noClassesToday')}
        </span>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Loading ...</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">{t('dashboard.noClassesToday')}</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id || `${getLessonTitle(item)}-${index}`}
              className="grid gap-4 rounded-[24px] border border-slate-200 p-4 md:grid-cols-[92px_minmax(0,1fr)_120px]">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {item.startTime || '—'}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {item.endTime || ''}
                </p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-xl font-semibold text-slate-900">
                  {getLessonTitle(item)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {getLessonMeta(item) || t('dashboard.noExtraInfo')}
                </p>
              </div>

              <div className="flex items-start justify-start md:justify-end">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  {getLessonRoom(item)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
