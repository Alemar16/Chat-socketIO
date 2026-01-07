import PropTypes from 'prop-types';
import { XMarkIcon, ShieldCheckIcon, RocketLaunchIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next'; // Added Trans just in case, but using separated keys

const ModalSection = ({ title, icon: Icon, children, colorClass, isOpen, onToggle }) => (
    <div className="border border-gray-100 rounded-lg overflow-hidden transition-all duration-300">
        <button 
            onClick={onToggle}
            className={`w-full flex items-center justify-between p-3 ${colorClass.bg} hover:brightness-95 transition-all text-left group`}
        >
            <div className={`flex items-center gap-2 font-semibold ${colorClass.text}`}>
                <Icon className="w-5 h-5" />
                <h4>{title}</h4>
            </div>
            <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${colorClass.text}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </div>
        </button>
        <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <div className="p-4 bg-white text-sm text-gray-600 space-y-2 border-t border-gray-100">
                {children}
            </div>
        </div>
    </div>
);

ModalSection.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    children: PropTypes.node.isRequired,
    colorClass: PropTypes.shape({
        bg: PropTypes.string,
        text: PropTypes.string,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export const RecommendationsModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    // Initial state: first section open, others closed
    const [openSections, setOpenSections] = useState({
        advantages: true, // Default open
        usage: false,
        security: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="bg-purple-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <h3 className="text-white font-bold text-lg tracking-wide">{t('recommendations.title')}</h3>
                    <button 
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                    
                    {/* Intro */}
                    <p className="text-gray-600 text-sm leading-relaxed pb-2">
                        <Trans i18nKey="recommendations.intro" components={{ span: <span className="text-purple-600 font-bold" /> }} />
                    </p>

                    {/* Section 1: Advantages */}
                    <ModalSection 
                        title={t('recommendations.advantages.title')} 
                        icon={RocketLaunchIcon}
                        colorClass={{ bg: 'bg-purple-50', text: 'text-purple-700' }}
                        isOpen={openSections.advantages}
                        onToggle={() => toggleSection('advantages')}
                    >
                        <ul className="space-y-3 list-disc list-inside">
                            <li><span className="font-medium text-purple-900">{t('recommendations.advantages.speedTitle')}</span> {t('recommendations.advantages.speedContent')}</li>
                            <li><span className="font-medium text-purple-900">{t('recommendations.advantages.privacyTitle')}</span> {t('recommendations.advantages.privacyContent')}</li>
                            <li><span className="font-medium text-purple-900">{t('recommendations.advantages.noLogsTitle')}</span> {t('recommendations.advantages.noLogsContent')}</li>
                            <li><span className="font-medium text-purple-900">{t('recommendations.advantages.simplicityTitle')}</span> {t('recommendations.advantages.simplicityContent')}</li>
                            <li><span className="font-medium text-purple-900">{t('recommendations.advantages.flexibilityTitle')}</span> {t('recommendations.advantages.flexibilityContent')}</li>
                        </ul>
                    </ModalSection>

                    {/* Section 2: Main Use */}
                    <ModalSection 
                        title={t('recommendations.usage.title')} 
                        icon={ChatBubbleLeftRightIcon}
                        colorClass={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
                        isOpen={openSections.usage}
                        onToggle={() => toggleSection('usage')}
                    >
                        <ul className="space-y-2 list-disc list-inside">
                            <li><span className="font-medium text-blue-900">{t('recommendations.usage.ephemeralTitle')}</span> {t('recommendations.usage.ephemeralContent')}</li>
                            <li><span className="font-medium text-blue-900">{t('recommendations.usage.coordinationTitle')}</span> {t('recommendations.usage.coordinationContent')}</li>
                            <li><span className="font-medium text-blue-900">{t('recommendations.usage.sharingTitle')}</span> {t('recommendations.usage.sharingContent')}</li>
                            <li><span className="font-medium text-blue-900">{t('recommendations.usage.privateDataTitle')}</span> {t('recommendations.usage.privateDataContent')}</li>
                        </ul>
                    </ModalSection>

                    {/* Section 3: Safety/Guidelines */}
                    <ModalSection 
                        title={t('recommendations.security.title')} 
                        icon={ShieldCheckIcon}
                        colorClass={{ bg: 'bg-green-50', text: 'text-green-600' }}
                        isOpen={openSections.security}
                        onToggle={() => toggleSection('security')}
                    >
                        <ul className="space-y-2">
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span>{t('recommendations.security.passwords')}</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span>{t('recommendations.security.reload')}</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span>{t('recommendations.security.respect')}</span>
                            </li>
                        </ul>
                    </ModalSection>

                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end flex-shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        {t('recommendations.understood')}
                    </button>
                </div>

            </div>
        </div>
    );
};

RecommendationsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
