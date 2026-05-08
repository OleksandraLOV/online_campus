import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Notification } from '../types';
import { useTranslation } from 'react-i18next';

const TYPE_LABEL_KEYS: Record<string, string> = {
  schedule_change: 'notifications.types.schedule_change',
  new_assignment: 'notifications.types.new_assignment',
  grade: 'notifications.types.grade',
  announcement: 'notifications.types.announcement',
  system: 'notifications.types.system',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'uk-UA';

  useEffect(() => {
    api
      .get('/notifications')
      .then(({ data }) => setNotifications(data))
      .catch(() => {});
  }, []);

  const handleMarkAllRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, readFlag: true })));
  };

  const handleMarkRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readFlag: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.readFlag).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t('notifications.title')}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-800">
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">{t('notifications.empty')}</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((ntf) => (
            <div
              key={ntf.id}
              onClick={() => !ntf.readFlag && handleMarkRead(ntf.id)}
              className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition-colors ${
                ntf.readFlag ? 'border-gray-200' : 'border-blue-300 bg-blue-50'
              }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {TYPE_LABEL_KEYS[ntf.type]
                        ? t(TYPE_LABEL_KEYS[ntf.type])
                        : ntf.type}
                    </span>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {ntf.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{ntf.message}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {new Date(ntf.createdAt).toLocaleDateString(locale)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
