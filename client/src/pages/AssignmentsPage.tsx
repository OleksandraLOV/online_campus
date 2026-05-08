import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Assignment } from '../types';
import { useTranslation } from 'react-i18next';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'uk-UA';

  useEffect(() => {
    api
      .get('/courses/assignments/my')
      .then(({ data }) => setAssignments(data))
      .catch(() => {});
  }, []);

  const getStatusBadge = (assignment: Assignment) => {
    if (!assignment.submission) {
      const isOverdue = new Date(assignment.dueDate) < new Date();

      return isOverdue
        ? {
            label: t('assignments.statusOverdue'),
            color: 'bg-red-100 text-red-700',
          }
        : {
            label: t('assignments.statusNotSubmitted'),
            color: 'bg-yellow-100 text-yellow-700',
          };
    }

    if (assignment.submission.status === 'graded') {
      return {
        label: t('assignments.statusGraded', {
          score: assignment.submission.score,
          maxScore: assignment.maxScore,
        }),
        color: 'bg-green-100 text-green-700',
      };
    }

    return {
      label: t('assignments.statusPending'),
      color: 'bg-blue-100 text-blue-700',
    };
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('assignments.title')}
      </h1>

      {assignments.length === 0 ? (
        <p className="text-gray-400 text-sm">{t('assignments.empty')}</p>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => {
            const status = getStatusBadge(a);
            return (
              <div
                key={a.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{a.courseName}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {a.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span>
                    {t('assignments.deadline')}:{' '}
                    {new Date(a.dueDate).toLocaleDateString(locale)}
                  </span>
                  <span>
                    {t('assignments.maxScore')}: {a.maxScore}
                  </span>
                  {a.submission?.comment && (
                    <span className="text-gray-600">
                      {a.submission?.comment && (
                        <p>
                          {t('assignments.comment')}: {a.submission.comment}
                        </p>
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
