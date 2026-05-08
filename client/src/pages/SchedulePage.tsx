import { useEffect, useState } from 'react';
import api from '../services/api';
import type { ScheduleEntry } from '../types';
import { useTranslation } from 'react-i18next';

const TYPE_LABEL_KEYS: Record<string, string> = {
  lecture: 'schedule.types.lecture',
  seminar: 'schedule.types.seminar',
  lab: 'schedule.types.lab',
  exam: 'schedule.types.exam',
  consultation: 'schedule.types.consultation',
};

export default function SchedulePage() {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [view, setView] = useState<'day' | 'week'>('week');
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'uk-UA';

  useEffect(() => {
    api.get('/schedule/my').then(({ data }) => setEntries(data)).catch(() => {});
  }, []);

  const groupedByDate = entries.reduce<Record<string, ScheduleEntry[]>>((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort();

  const today = new Date().toISOString().split('T')[0];
  const filteredDates = view === 'day'
    ? sortedDates.filter((d) => d === today)
    : sortedDates;

 const formatDate = (dateStr: string) => {
   const date = new Date(dateStr + 'T00:00:00');

   return date.toLocaleDateString(locale, {
     weekday: 'long',
     day: '2-digit',
     month: '2-digit',
     year: 'numeric',
   });
 };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t('schedule.title')}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {t('schedule.day')}
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {t('schedule.week')}
          </button>
        </div>
      </div>

      {filteredDates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
          {view === 'day'
            ? t('schedule.noClassesToday')
            : t('schedule.notFound')}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDates.map((date) => (
            <div key={date}>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                {formatDate(date)}
              </h2>
              <div className="space-y-2">
                {groupedByDate[date]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className={`bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4 ${
                        entry.status === 'cancelled'
                          ? 'border-red-200 opacity-60'
                          : 'border-gray-200'
                      }`}>
                      <div className="text-center min-w-[80px]">
                        <div className="text-lg font-bold text-blue-700">
                          {entry.startTime}
                        </div>
                        <div className="text-xs text-gray-400">
                          {entry.endTime}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {entry.courseName}
                          {entry.status === 'cancelled' && (
                            <span className="ml-2 text-xs text-red-600">
                              {t('schedule.cancelled')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {TYPE_LABEL_KEYS[entry.type]
                            ? t(TYPE_LABEL_KEYS[entry.type])
                            : entry.type}
                        </div>
                        {entry.groupCode && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {t('schedule.group')}: {entry.groupCode}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
