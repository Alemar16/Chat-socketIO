import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="text-center">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-2 lg:py-2">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm text-gray-800 dark:text-gray-300 text-center">
            © 2026{" "}
            <a
              href="https://github.com/Alemar16/Chat-socketIO#"
              target="_blank"
              rel="noopener noreferrer"
              title="Portfolio"
              className="hover:underline text-purple-800 dark:text-purple-400 font-bold hover:text-white dark:hover:text-white"
            >
              FlashChat
            </a>
            {t('footer.rights')}
          </span>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
