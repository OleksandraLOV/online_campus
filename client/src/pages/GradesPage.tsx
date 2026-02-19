import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Grade } from '../types';

const TYPE_LABELS: Record<string, string> = {
  current: 'Поточна',
  module: 'Модульна',
  exam: 'Іспит',
  final: 'Підсумкова',
};

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    api.get('/courses/grades/my').then(({ data }) => setGrades(data)).catch(() => {});
  }, []);

  const groupedByCourse = grades.reduce<Record<string, { courseName: string; grades: Grade[] }>>((acc, g) => {
    const key = g.courseAssignmentId;
    if (!acc[key]) {
      acc[key] = { courseName: g.courseName || 'Невідома дисципліна', grades: [] };
    }
    acc[key].grades.push(g);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Мої оцінки</h1>

      {Object.keys(groupedByCourse).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
          Оцінок немає
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByCourse).map(([caId, data]) => (
            <div key={caId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{data.courseName}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2 pr-4">Дата</th>
                      <th className="pb-2 pr-4">Тип</th>
                      <th className="pb-2 pr-4">Оцінка</th>
                      <th className="pb-2">Коментар</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.grades.map((g) => (
                      <tr key={g.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">{new Date(g.date).toLocaleDateString('uk-UA')}</td>
                        <td className="py-2 pr-4">{TYPE_LABELS[g.type] || g.type}</td>
                        <td className="py-2 pr-4">
                          <span className={`font-bold ${g.value >= 8 ? 'text-green-600' : g.value >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {g.value}
                          </span>
                        </td>
                        <td className="py-2 text-gray-500">{g.comment || '-'}</td>
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
