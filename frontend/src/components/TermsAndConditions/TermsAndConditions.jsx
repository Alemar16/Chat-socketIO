import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  const showTermsModal = () => {
    Swal.fire({
      title: t('terms.title'),
      html: t('terms.fullText'),
      confirmButtonText: t('terms.close'),
      customClass: {
        popup: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        title: 'text-gray-900 dark:text-white',
        htmlContainer: 'text-gray-700 dark:text-gray-300',
        confirmButton: 'bg-purple-600 dark:bg-purple-700 text-white'
      }
    });
  };
  return (
    <div className="cursor-pointer hover:underline">
      <h6 onClick={showTermsModal}>{t('terms.link')}</h6>
    </div>
  );
};

export default TermsAndConditions;
