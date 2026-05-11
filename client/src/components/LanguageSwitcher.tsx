import { useTranslation } from 'react-i18next';

type LanguageSwitcherProps = {
  className?: string;
  showLabel?: boolean;
};

export default function LanguageSwitcher({
  className = '',
  showLabel = true,
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  const baseBtn =
    'flex h-14 min-w-[56px] items-center justify-center rounded-full border px-4 text-sm font-medium transition';
  const activeBtn = 'border-blue-700 bg-blue-700 text-white';
  const inactiveBtn =
    'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-gray-500 hidden sm:inline">
          {t('layout.language')}:
        </span>
      )}

      <button
        type="button"
        onClick={() => i18n.changeLanguage('uk')}
        className={`${baseBtn} ${
          i18n.language.startsWith('uk') ? activeBtn : inactiveBtn
        }`}>
        UA
      </button>

      <button
        type="button"
        onClick={() => i18n.changeLanguage('en')}
        className={`${baseBtn} ${
          i18n.language.startsWith('en') ? activeBtn : inactiveBtn
        }`}>
        EN
      </button>
    </div>
  );
}
