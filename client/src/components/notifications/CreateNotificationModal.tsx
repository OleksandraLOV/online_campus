import { useState } from 'react';
import api from '../../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateNotificationModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [title, setTitle] = useState('');         // нове поле
  const [message, setMessage] = useState('');
  const [type, setType] = useState('announcement');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post('/notifications', {
        title,    // надсилаємо назву
        message,
        type,
      });

      // очищаємо всі поля
      setTitle('');
      setMessage('');
      setType('announcement');

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // стиль для чорних країв
  const blackBorder = {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid black',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          width: '400px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h2>Створити сповіщення</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Вибір типу */}
          <div style={{ marginBottom: '15px' }}>
            <label>Тип</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={blackBorder}
            >
              <option value="announcement">Оголошення</option>
              <option value="system">Система</option>
              <option value="grade">Оцінка</option>
              <option value="new_assignment">Завдання</option>
              <option value="schedule_change">Розклад</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Заголовок сповіщення</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={blackBorder}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Текст сповіщення</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows={5}
              style={{
                ...blackBorder,
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Створення...' : 'Створити'}
          </button>
        </form>
      </div>
    </div>
  );
}