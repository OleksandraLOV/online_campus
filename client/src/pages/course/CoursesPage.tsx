import { useEffect, useState } from 'react';
import api from '../../services/api';
import { filesApi } from '../../services/api';
import type { CourseAssignment, Material } from '../../types';
import { useTranslation } from 'react-i18next';
import { FileUploader } from '../../components/FileUploader';
import {useAuthStore} from '../../store/authStore';


function CourseCard({ ca, role, t }: { ca: CourseAssignment; role?: string; t: any }) {
  const [title, setTitle] = useState('');

  const [materials, setMaterials] = useState<Material[]>([]);
  const isTeacher = role === 'teacher' || role === 'department_head' || role === 'admin';
  useEffect(() => {
    api.get(`/courses/${ca.id}/materials`)
       .then(({ data }) => setMaterials(data))
       .catch(() => {});
  }, [ca.id]);

  const handleUpload = async (file: File) => {
    if (!title.trim()) {
      alert('Будь ласка, введіть назву матеріалу перед завантаженням!');
      throw new Error('Title is missing');
    }
    await filesApi.uploadMaterial(ca.id, title, file);
    setTitle('');
    
    api.get(`/courses/${ca.id}/materials`).then(({ data }) => setMaterials(data));
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
  const handleDeleteMaterial = async (fileId: string, materialId: string) => {
  if (!window.confirm('Ви впевнені, що хочете видалити цей матеріал?')) return;
  
  try {
    await api.delete(`/files/${fileId}`);
    
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
  } catch (error) {
    console.error('Помилка видалення:', error);
    alert('Не вдалося видалити матеріал.');
  }
};
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
          {ca.courseCode}
        </span>
        {ca.credits && (
          <span className="text-xs text-gray-400">
            {ca.credits} {t('courses.credits')}
          </span>
        )}
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2">{ca.courseName}</h3>
      <div className="flex-grow">
              {ca.teacherName && <p className="text-sm text-gray-500">{t('courses.teacher')}: {ca.teacherName}</p>}
              {ca.groupCode && <p className="text-sm text-gray-500">{t('courses.group')}: {ca.groupCode}</p>}
              <p className="text-xs text-gray-400 mt-2 mb-4">{ca.academicYear}, {t('courses.semester')} {ca.semester}</p>
            </div>
            {materials.length > 0 && (
              <div className="mt-2 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Навчальні матеріали:</h4>
                <ul className="space-y-2">
                  {materials.map((m) => (
                    <li key={m.id} className="flex items-center justify-between group bg-gray-50 px-3 py-2 rounded-lg">
                    <button 
                      onClick={() => handleDownload(m.fileLink, m.originalName)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
                    >
                      {m.title} <span className="text-gray-400 text-xs"></span>
                    </button>
                    {isTeacher && (
                        <button
                          onClick={() => handleDeleteMaterial(m.fileLink, m.id)}
                          className="text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 px-2.5 py-1.5 rounded transition-colors"
                          title="Видалити матеріал"
                        >
                          🗑️
                        </button>
                    )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
      {isTeacher && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Завантажити новий матеріал
          </p>
          <input
            type="text"
            placeholder="Назва лекції чи методички..."
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FileUploader
            allowedTypes={['.png', '.jpeg', '.jpg', '.pdf', '.doc', '.docx', '.zip']}
            onUpload={handleUpload}
          />
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseAssignment[]>([]);
  const { t } = useTranslation();
  
  const user = useAuthStore((state: any) => state.user); 

  useEffect(() => {
    api.get('/courses/my').then(({ data }) => setCourses(data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('courses.title')}
      </h1>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
          {t('courses.notFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((ca) => (
            <CourseCard key={ca.id} ca={ca} role={user?.role} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}