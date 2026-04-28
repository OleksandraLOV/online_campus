import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { login: doLogin, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await doLogin(login, password);
      navigate('/dashboard');
    } catch {
      // error handled in store
    }
  };

  const testAccounts = [
    { login: 'student1', labelKey: 'roles.student' },
    { login: 'teacher1', labelKey: 'roles.teacher' },
    { login: 'dispatcher1', labelKey: 'roles.dispatcher' },
    { login: 'head1', labelKey: 'roles.departmentHead' },
    { login: 'dean1', labelKey: 'roles.dean' },
    { login: 'rector', labelKey: 'roles.rector' },
    { login: 'president', labelKey: 'roles.president' },
    { login: 'admin', labelKey: 'roles.admin' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('app.title')}</h1>
          <p className="text-gray-500 mt-1">{t('app.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.loginLabel')}
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder={t('auth.loginPlaceholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.passwordLabel')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder={t('auth.passwordPlaceholder')}
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium">
            {isLoading ? t('auth.loading') : t('auth.submit')}
          </button>
        </form>

        <div className="mt-8 border-t pt-4">
          <p className="text-xs text-gray-400 mb-3 text-center">
            {t('auth.testAccounts')}
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {testAccounts.map((acc) => (
              <button
                key={acc.login}
                type="button"
                onClick={() => {
                  setLogin(acc.login);
                  setPassword('password123');
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-2 rounded transition-colors">
                {t(acc.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
