import type { Notification } from '../../types';

const TYPE_ICONS: Record<string, string> = {
  schedule_change: 'Розклад',
  new_assignment: 'Завдання',
  grade: 'Оцінка',
  announcement: 'Оголошення',
  system: 'Система',
};

interface Props {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
}: Props) {
  return (
    <details
      onClick={() => {
        if (!notification.readFlag) {
          onRead(notification.id);
        }
      }}
      className={`
        border
        rounded-xl
        mb-3
        overflow-hidden
        transition-colors
        ${
          notification.readFlag
            ? 'bg-gray-50 border-gray-200'
            : 'bg-blue-50 border-blue-200'
        }
      `}
    >
      <summary
        className="
          list-none
          cursor-pointer
          p-4
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div>
            <strong>
              {TYPE_ICONS[notification.type]}
            </strong>

            <div className="mt-1 font-semibold">
              {notification.title}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onDelete(notification.id);
            }}
            className="
              text-gray-400
              hover:text-red-500
              transition-colors
              text-sm
            "
          >
            ✕
          </button>
        </div>
      </summary>

      <div
        className="
          px-4
          pb-4
          border-t
          border-gray-200
        "
      >
        <p className="mt-3 text-gray-700">
          {notification.message}
        </p>

        <small className="text-gray-500">
          {notification.readFlag
            ? 'Прочитано'
            : 'Не прочитано'}
        </small>
      </div>
    </details>
  );
}