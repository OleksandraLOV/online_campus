import { useEffect, useState } from 'react';
import api from '../services/api';
import type { CourseAssignment } from '../types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseAssignment[]>([]);

  useEffect(() => {
    api.get('/courses/my').then(({ data }) => setCourses(data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Мої дисципліни</h1>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-400">
          Дисципліни не знайдено
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((ca) => (
            <div key={ca.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                  {ca.courseCode}
                </span>
                {ca.credits && (
                  <span className="text-xs text-gray-400">{ca.credits} кредитів</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{ca.courseName}</h3>
              {ca.teacherName && (
                <p className="text-sm text-gray-500">Викладач: {ca.teacherName}</p>
              )}
              {ca.groupCode && (
                <p className="text-sm text-gray-500">Група: {ca.groupCode}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {ca.academicYear}, семестр {ca.semester}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
