import { useEffect, useState } from 'react';
import api from '../services/api';
import type { CourseAssignment } from '../types';
import { useTranslation } from 'react-i18next';

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseAssignment[]>([]);
  const { t } = useTranslation();

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
            <div
              key={ca.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
              <h3 className="font-semibold text-gray-900 mb-2">
                {ca.courseName}
              </h3>
              {ca.teacherName && (
                <p className="text-sm text-gray-500">
                  {t('courses.teacher')}: {ca.teacherName}
                </p>
              )}
              {ca.groupCode && (
                <p className="text-sm text-gray-500">
                  {t('courses.group')}: {ca.groupCode}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {ca.academicYear}, {t('courses.semester')} {ca.semester}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
