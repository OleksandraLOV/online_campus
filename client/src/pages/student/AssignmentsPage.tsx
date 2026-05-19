import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Assignment } from '../../types';
import { useTranslation } from 'react-i18next';
import { FileUploader } from '../../components/FileUploader';
import { filesApi } from '../../services/api';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'uk-UA';

  const refreshAssignments = () => {
    api
      .get('/courses/assignments/my')
      .then(({ data }) => setAssignments(data))
      .catch(() => {});
  };

  useEffect(() => {
    refreshAssignments();
  }, []);

  const getStatusBadge = (assignment: Assignment) => {
    if (!assignment.submission) {
      const isOverdue = new Date(assignment.dueDate) < new Date();
      return isOverdue
        ? { label: t('assignments.statusOverdue'), color: 'bg-red-100 text-red-700' }
        : { label: t('assignments.statusNotSubmitted'), color: 'bg-yellow-100 text-yellow-700' };
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

    return { label: t('assignments.statusPending'), color: 'bg-blue-100 text-blue-700' };
  };
  const handleDownload = async (fileId: string, originalName: string) => {
    try {

      const response = await api.get(`/files/download/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName); 
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Помилка завантаження файлу:', error);
      alert('Не вдалося завантажити файл. Можливо, його було видалено.');
    }
  };
const handleDelete = async (fileId: string, assignmentId: string) => {
  if (!window.confirm('Ви впевнені, що хочете видалити цю роботу?')) return;
  
  try {
    await api.delete(`/files/${fileId}`);
    setAssignments((prev) => 
      prev.map((a) => 
        a.id === assignmentId ? { ...a, submission: null } : a
      )
    );
    alert('Роботу успішно видалено!');
  } catch (error) {
    console.error('Помилка видалення:', error);
    alert('Не вдалося видалити файл.');
  }
};
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('assignments.title')}
      </h1>

      {assignments.length === 0 ? (
        <p className="text-gray-400 text-sm">{t('assignments.empty')}</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => {
            const status = getStatusBadge(a);
            return (
              <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{a.courseName}</p>
                    <p className="text-sm text-gray-600 mt-2">{a.description}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                  {a.submission ? (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-3">Ваша завантажена робота:</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleDownload(a.submission!.fileLink, a.submission!.originalName)}
                          className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {a.submission!.originalName || 'Завантажений файл'}
                        </button>
                        <button
                          onClick={() => handleDelete(a.submission!.fileLink, a.id)}
                          className="inline-flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ) : (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Прикріпити файл роботи
                    </p>
                    <FileUploader 
                      allowedTypes={['.pdf', '.doc', '.docx', '.zip']} 
                      onUpload={async (file) => {
                        await filesApi.submitAssignment(a.id, file);
                        refreshAssignments();
                      }} 
                    />
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-gray-50 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400">
                  <span>
                    {t('assignments.deadline')}: {new Date(a.dueDate).toLocaleDateString(locale)}
                  </span>
                  <span>
                    {t('assignments.maxScore')}: {a.maxScore}
                  </span>
                  
                  {a.submission?.comment && (
                    <div className="w-full mt-1 text-gray-600 italic">
                      <span className="font-medium text-gray-500">{t('assignments.comment')}:</span> {a.submission.comment}
                    </div>
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