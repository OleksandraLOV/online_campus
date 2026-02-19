import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Role, ROLE_LABELS } from '../types';
import type { ScheduleEntry, Notification } from '../types';
import api from '../services/api';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [todaySchedule, setTodaySchedule] = useState<ScheduleEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    api.get('/schedule/my').then(({ data }) => {
      const today = new Date().toISOString().split('T')[0];
      setTodaySchedule(data.filter((e: ScheduleEntry) => e.date === today));
    }).catch(() => {});

    api.get('/notifications').then(({ data }) => {
      setNotifications(data.slice(0, 5));
    }).catch(() => {});
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Вітаємо, {user.firstName} {user.lastName}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Профіль</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Роль:</span> {ROLE_LABELS[user.role]}</p>
            <p><span className="text-gray-500">Email:</span> {user.email}</p>
            {user.phone && <p><span className="text-gray-500">Телефон:</span> {user.phone}</p>}
            {user.studentProfile && (
              <>
                <p><span className="text-gray-500">Залікова книжка:</span> {user.studentProfile.recordBookNumber}</p>
                <p><span className="text-gray-500">Курс:</span> {user.studentProfile.year}</p>
              </>
            )}
            {user.teacherProfile && (
              <p><span className="text-gray-500">Посада:</span> {user.teacherProfile.position}</p>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Розклад на сьогодні</h2>
          {todaySchedule.length === 0 ? (
            <p className="text-gray-400 text-sm">Занять сьогодні немає</p>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((entry) => (
                <div key={entry.id} className={`p-3 rounded-lg border ${entry.status === 'cancelled' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="text-sm font-medium">{entry.courseName}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {entry.startTime} - {entry.endTime} | {entry.classroom}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{entry.type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Сповіщення</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-400 text-sm">Немає сповіщень</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((ntf) => (
                <div key={ntf.id} className={`p-3 rounded-lg border ${ntf.readFlag ? 'bg-gray-50 border-gray-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="text-sm font-medium">{ntf.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{ntf.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Role-specific widgets */}
      {(user.role === Role.ADMIN || user.role === Role.PRESIDENT || user.role === Role.RECTOR) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Панель управління</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Користувачів" value="15" />
            <StatCard label="Груп" value="3" />
            <StatCard label="Дисциплін" value="5" />
            <StatCard label="Аудиторій" value="5" />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-blue-700">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );
}
