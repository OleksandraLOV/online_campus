import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Grade } from '../types';
import { useTranslation } from 'react-i18next';

const TYPE_LABEL_KEYS: Record<string, string> = {
  current: 'grades.types.current',
  module: 'grades.types.module',
  exam: 'grades.types.exam',
  final: 'grades.types.final',
};

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
const { t, i18n } = useTranslation();
const locale = i18n.language === 'en' ? 'en-US' : 'uk-UA';

  useEffect(() => {
    api.get('/courses/grades/my').then(({ data }) => setGrades(data)).catch(() => {});
  }, []);

  const groupedByCourse = grades.reduce<Record<string, { courseName: string; grades: Grade[] }>>((acc, g) => {
    const key = g.courseAssignmentId;
    if (!acc[key]) {
      acc[key] = { courseName: g.courseName || t('grades.unknownCourse'), grades: [] };
    }
    acc[key].grades.push(g);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('grades.title')}
      </h1>

      {Object.keys(groupedByCourse).length === 0 ? (
        <p className="text-gray-400 text-sm">{t('grades.empty')}</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByCourse).map(([caId, data]) => (
            <div
              key={caId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {data.courseName}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="min-w-[650px] w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th>{t('grades.date')}</th>
                      <th>{t('grades.type')}</th>
                      <th>{t('grades.grade')}</th>
                      <th>{t('grades.comment')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.grades.map((g) => (
                      <tr key={g.id} className="border-b last:border-0">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(g.date).toLocaleDateString(locale)}
                        </td>
                        <td className="py-2 pr-4">
                          {TYPE_LABEL_KEYS[g.type]
                            ? t(TYPE_LABEL_KEYS[g.type])
                            : g.type}
                        </td>
                        <td className="py-2 pr-4">
                          <span
                            className={`font-bold ${g.value >= 8 ? 'text-green-600' : g.value >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {g.value}
                          </span>
                        </td>
                        <td className="py-2 text-gray-500">
                          {g.comment || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
