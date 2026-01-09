import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="text-center">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-2 lg:py-2">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm text-gray-800 dark:text-gray-300 text-center">
            © 2026 FlashChat {t('footer.rights')}
          </span>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
