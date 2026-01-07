import React from 'react'
import { useTranslation } from 'react-i18next';

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

export default GreetingComponent