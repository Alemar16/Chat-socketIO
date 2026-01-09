import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function GreetingComponent({username}) {
  const { t } = useTranslation();

  return (
    <div>
        <span className="text-2xl font-bold text-white rounded-md font-mono p-2">
            {t('greeting', { username })}
          </span>
    </div>
  )
}

GreetingComponent.propTypes = {
  username: PropTypes.string.isRequired,
};

export default GreetingComponent