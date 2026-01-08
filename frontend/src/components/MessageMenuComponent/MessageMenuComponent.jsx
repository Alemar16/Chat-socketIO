import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
    ChevronDownIcon, 
    ArrowUturnLeftIcon, 
    DocumentDuplicateIcon, 
    FaceSmileIcon, 
    TrashIcon 
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const MessageMenuComponent = ({ isOwnMessage, onReply, onCopy, onReact, onDelete }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleAction = (action) => {
        setIsOpen(false);
        if (action) action();
    };

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {/* Trigger Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`p-1 rounded-full hover:bg-white/20 transition-colors`}
                title={t('menu.options', 'Message Options')}
            >
                <ChevronDownIcon className="w-5 h-5 text-white drop-shadow-sm opacity-80 hover:opacity-100" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-6 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/50 py-1 z-50 animate-scale-in origin-top-right">
                    
                    {/* Reply */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleAction(onReply); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <ArrowUturnLeftIcon className="w-4 h-4" />
                        {t('menu.reply', 'Responder')}
                    </button>

                    {/* Copy */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleAction(onCopy); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                        {t('menu.copy', 'Copiar')}
                    </button>

                    {/* React */}
                     <button
                        onClick={(e) => { e.stopPropagation(); handleAction(onReact); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <FaceSmileIcon className="w-4 h-4" />
                        {t('menu.react', 'Reaccionar')}
                    </button>

                    {/* Delete (Only specific condition) */}
                    {isOwnMessage && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAction(onDelete); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 mt-1 pt-2"
                        >
                            <TrashIcon className="w-4 h-4" />
                            {t('menu.delete', 'Eliminar')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

MessageMenuComponent.propTypes = {
    isOwnMessage: PropTypes.bool.isRequired,
    onReply: PropTypes.func,
    onCopy: PropTypes.func,
    onReact: PropTypes.func,
    onDelete: PropTypes.func,
};

export default MessageMenuComponent;
