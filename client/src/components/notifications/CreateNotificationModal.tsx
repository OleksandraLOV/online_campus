import { useState, useEffect } from 'react';
import api from '../../services/api';

interface ReferenceItem {
  id?: string;
  _id?: string;
  code?: string;
  name?: string;
}

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
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('announcement');
  const [loading, setLoading] = useState(false);

  const [groups, setGroups] = useState<ReferenceItem[]>([]);
  const [targetType, setTargetType] = useState<'all' | 'group'>('all');
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    if (!open) return;

    api.get('/references/groups')
      .then(({ data }) => setGroups(data))
      .catch(() => {});
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post('/notifications', {
        title,
        message,
        type,
        targetType,
        groupId: targetType === 'group' ? groupId : null,
      });

      setTitle('');
      setMessage('');
      setType('announcement');
      setTargetType('all');
      setGroupId('');

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Спільний стиль для полів вводу
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    marginTop: '6px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box' as const,
  };

  const focusStyle = {
    borderColor: '#6366f1',
    boxShadow: '0 0 0 3px rgba(99,102,241,0.15)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        }}
      >
        {/* Заголовок і кнопка закриття */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>
            Створити сповіщення
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#334155';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Тип сповіщення */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>
              Тип
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={inputStyle}
              onFocus={e => {
                e.currentTarget.style.borderColor = focusStyle.borderColor;
                e.currentTarget.style.boxShadow = focusStyle.boxShadow;
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="announcement">Оголошення</option>
              <option value="system">Система</option>
              <option value="grade">Оцінка</option>
              <option value="new_assignment">Завдання</option>
              <option value="schedule_change">Розклад</option>
            </select>
          </div>

          {/* Заголовок */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>
              Заголовок сповіщення
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={inputStyle}
              placeholder="Введіть заголовок"
              onFocus={e => {
                e.currentTarget.style.borderColor = focusStyle.borderColor;
                e.currentTarget.style.boxShadow = focusStyle.boxShadow;
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Текст сповіщення */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>
              Текст сповіщення
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows={5}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
              placeholder="Опишіть сповіщення"
              onFocus={e => {
                e.currentTarget.style.borderColor = focusStyle.borderColor;
                e.currentTarget.style.boxShadow = focusStyle.boxShadow;
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Одержувачі */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>
              Кому відправити
            </label>
            <select
              value={targetType}
              onChange={e => setTargetType(e.target.value as 'all' | 'group')}
              style={inputStyle}
              onFocus={e => {
                e.currentTarget.style.borderColor = focusStyle.borderColor;
                e.currentTarget.style.boxShadow = focusStyle.boxShadow;
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="all">Усім користувачам</option>
              <option value="group">Конкретній групі</option>
            </select>
          </div>

          {/* Група (умовно) */}
          {targetType === 'group' && (
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                Група
              </label>
              <select
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => {
                  e.currentTarget.style.borderColor = focusStyle.borderColor;
                  e.currentTarget.style.boxShadow = focusStyle.boxShadow;
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">Оберіть групу</option>
                {groups.map(g => (
                  <option key={g.id || g._id} value={g.id || g._id}>
                    {g.code}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Кнопка відправки */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#94a3b8' : '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s, transform 0.1s',
              marginTop: '8px',
            }}
            onMouseEnter={e => {
              if (!loading) e.currentTarget.style.backgroundColor = '#4f46e5';
            }}
            onMouseLeave={e => {
              if (!loading) e.currentTarget.style.backgroundColor = '#6366f1';
            }}
            onMouseDown={e => {
              if (!loading) e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={e => {
              if (!loading) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loading ? 'Створення...' : 'Створити'}
          </button>
        </form>
      </div>
    </div>
  );
}