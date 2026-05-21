
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import type { Notification } from '../../types';
import { useAuthStore } from '../../store/authStore';
import CreateNotificationModal from '../../components/notifications/CreateNotificationModal';
import NotificationItem from '../../components/notifications/NotificationItem';

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const { user } = useAuthStore();

  const { t, i18n } = useTranslation();

  const locale =
    i18n.language === 'en'
      ? 'en-US'
      : 'uk-UA';

  const unreadCount = notifications.filter(
    n => !n.readFlag,
  ).length;

  const fetchNotifications = async (isMounted = () => true) => {
    try {
      const { data } = await api.get(
        '/notifications',
      );

      if (isMounted()) {
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let mounted = true;

    void api
      .get('/notifications')
      .then(({ data }) => {
        if (mounted) {
          setNotifications(data);
        }
      })
      .catch(err => {
        console.error(err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleRead = async (id: string) => {
    try {
      await api.patch(
        `/notifications/${id}/read`,
      );

      setNotifications(prev =>
        prev.map(n =>
          n.id === id
            ? {
                ...n,
                readFlag: true,
              }
            : n,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);

      setNotifications(prev =>
        prev.filter(n => n.id !== id),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch(
        '/notifications/read-all',
      );

      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          readFlag: true,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      'Ви дійсно хочете видалити всі сповіщення?',
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete('/notifications');

      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t('nav.notifications')}
        </h1>

        {user?.role === 'admin' && (
          <button
            onClick={() =>
              setIsModalOpen(true)
            }
            className="rounded-lg border border-gray-400 px-4 py-2 transition-colors hover:bg-gray-200"
          >
            ➕ Створити сповіщення
          </button>
        )}
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="rounded-lg border border-gray-400 px-4 py-2 transition-colors hover:bg-gray-200"
          >
            Позначити всі як прочитані
          </button>
        )}

        {notifications.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="rounded-lg border border-red-300 px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
          >
            Видалити всі
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 && (
          <p className="text-gray-500">
            Немає сповіщень
          </p>
        )}

        {notifications.map(notification => (
          <div key={notification.id}>
            <NotificationItem
              notification={notification}
              onRead={handleRead}
              onDelete={handleDelete}
            />

            <div className="mt-1 text-right text-xs text-gray-400">
              {new Date(
                notification.createdAt,
              ).toLocaleDateString(locale)}
            </div>
          </div>
        ))}
      </div>

      <CreateNotificationModal
        open={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onCreated={fetchNotifications}
      />
    </div>
  );
}
