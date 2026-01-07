import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  const showTermsModal = () => {
    Swal.fire({
      title: t('terms.title'),
      html: t('terms.fullText'),
      confirmButtonText: t('terms.close'),
    });
  };
  return (
    <div className="cursor-pointer hover:underline">
      <h6 onClick={showTermsModal}>{t('terms.link')}</h6>
    </div>
  );
};

export default TermsAndConditions;
