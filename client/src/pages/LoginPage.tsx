import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { login: doLogin, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doLogin(login, password);
      navigate('/dashboard');
    } catch {
      // error is handled in store
    }
  };

  const testAccounts = [
    { login: 'student1', label: 'Студент' },
    { login: 'teacher1', label: 'Викладач' },
    { login: 'dispatcher1', label: 'Диспетчер' },
    { login: 'head1', label: 'Зав. кафедри' },
    { login: 'dean1', label: 'Декан' },
    { login: 'rector', label: 'Ректор' },
    { login: 'president', label: 'Президент' },
    { login: 'admin', label: 'Адмін' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Кампус МАУП</h1>
          <p className="text-gray-500 mt-1">Електронний кампус академії</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Логін</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Введіть логін"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Введіть пароль"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        {/* Test accounts */}
        <div className="mt-8 border-t pt-4">
          <p className="text-xs text-gray-400 mb-3 text-center">Тестові акаунти (пароль: password123)</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {testAccounts.map((acc) => (
              <button
                key={acc.login}
                onClick={() => { setLogin(acc.login); setPassword('password123'); }}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded transition-colors"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
