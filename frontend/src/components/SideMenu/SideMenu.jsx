import PropTypes from 'prop-types';
import QRCode from "react-qr-code";
import { 
    XMarkIcon, 
    ClipboardDocumentIcon, 
    LinkIcon, 
    UserIcon, 
    SpeakerWaveIcon, 
    SpeakerXMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    GlobeAltIcon,
    SunIcon,
    MoonIcon
} from "@heroicons/react/24/solid";
import Header from "../Header/Header";
import { ButtonLogout } from "../Buttons/ButtonLogout";
import Swal from 'sweetalert2';
import { useState } from 'react';
import { RecommendationsModal } from "../RecommendationsModal/RecommendationsModal";
import { useTranslation } from 'react-i18next';

const SideMenu = ({ isOpen, onClose, roomId, username, soundEnabled, setSoundEnabled, theme, setTheme, onLogout, connectedUsers }) => {
    
    const { t, i18n } = useTranslation();
    const [isUsersListOpen, setIsUsersListOpen] = useState(true);
    // const [language, setLanguage] = useState('en'); // Removed local state
    // const [theme, setTheme] = useState('light'); // Removed local state, now using props
    const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            Toast.fire({
                icon: "success",
                title: `${label} copied to clipboard`
            });
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const copyRoomUrl = () => {
        const url = window.location.href;
        copyToClipboard(url, "Room URL");
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Side Sheet */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Header Section */}
                <div className="pt-10 pb-4 px-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="transform scale-75 origin-center -mb-2">
                        <Header />
                    </div>
                    <div className="text-center mt-0">
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">{t('welcome')} </span>
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 text-lg">{username}!</span>
                    </div>
                </div>

                {/* Body Section */}
                <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8">
                    


                    {/* Connected Users Section */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => setIsUsersListOpen(!isUsersListOpen)}
                            className="w-full flex items-center justify-between text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-1"
                        >
                            <span>{t('connectedUsers')} ({connectedUsers.length})</span>
                            {isUsersListOpen ? (
                                <ChevronUpIcon className="w-4 h-4" />
                            ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                            )}
                        </button>
                        
                        {isUsersListOpen && (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                {connectedUsers.map((user, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div className="relative">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full text-purple-600 dark:text-purple-400">
                                                <UserIcon className="w-4 h-4" />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                        </div>
                                        <span className={`font-medium text-sm truncate ${user.username === username ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                            {user.username === username ? `${user.username} ${t('you')}` : user.username}
                                        </span>
                                    </div>
                                ))}
                                {connectedUsers.length === 0 && (
                                    <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-2">{t('noUsersConnected')}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Room Details */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => setIsRoomDetailsOpen(!isRoomDetailsOpen)}
                            className="w-full flex items-center justify-between text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-1"
                        >
                            <span>{t('roomDetails')}</span>
                            {isRoomDetailsOpen ? (
                                <ChevronUpIcon className="w-4 h-4" />
                            ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                            )}
                        </button>
                        
                        {isRoomDetailsOpen && (
                            <div className="space-y-3">
                                {/* Room ID Card */}
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase">{t('roomId')}</span>
                                        <span className="font-mono font-bold text-gray-800 dark:text-gray-100 text-lg tracking-wider">{roomId}</span>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(roomId, t('roomId'))}
                                        className="p-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                                        title="Copy ID"
                                    >
                                        <ClipboardDocumentIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                {/* QR Code Card */}
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase mb-2">{t('scanToJoin')}</span>
                                    <div className="bg-white p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <QRCode 
                                            value={window.location.href} 
                                            size={128}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                </div>

                                {/* Copy URL Card/Button */}
                                <button
                                    onClick={copyRoomUrl}
                                    className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group text-left"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase">{t('invitationLink')}</span>
                                        <span className="font-medium text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm">{t('copyLinkInvitation')}</span>
                                    </div>
                                    <div className="p-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 rounded-lg transition-colors">
                                        <LinkIcon className="w-5 h-5" />
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Settings Section */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="w-full flex items-center justify-between text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-1"
                        >
                            <span>{t('settings')}</span>
                            {isSettingsOpen ? (
                                <ChevronUpIcon className="w-4 h-4" />
                            ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                            )}
                        </button>

                        {isSettingsOpen && (
                            <div className="space-y-3">
                                {/* Notifications Toggle */}
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${soundEnabled ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'} transition-colors`}>
                                            {soundEnabled ? (
                                                <SpeakerWaveIcon className="w-5 h-5" />
                                            ) : (
                                                <SpeakerXMarkIcon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">{t('notificationsLabel')}</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={soundEnabled}
                                            onChange={(e) => setSoundEnabled(e.target.checked)}
                                        />
                                        <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>

                                {/* Language Toggle */}
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                            <GlobeAltIcon className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">{t('language')}</span>
                                    </div>
                                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                        <button 
                                            onClick={() => i18n.changeLanguage('en')}
                                            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${i18n.resolvedLanguage === 'en' ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                        >
                                            EN
                                        </button>
                                        <button 
                                            onClick={() => i18n.changeLanguage('es')}
                                            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${i18n.resolvedLanguage === 'es' ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                        >
                                            ES
                                        </button>
                                    </div>
                                </div>

                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-amber-100 text-amber-600'} transition-colors`}>
                                            {theme === 'dark' ? (
                                                <MoonIcon className="w-5 h-5" />
                                            ) : (
                                                <SunIcon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">{t('theme')}</span>
                                    </div>
                                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                        <button 
                                            onClick={() => setTheme('light')}
                                            className={`p-1 rounded-md transition-all ${theme === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                        >
                                            <SunIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => setTheme('dark')}
                                            className={`p-1 rounded-md transition-all ${theme === 'dark' ? 'bg-white dark:bg-gray-600 text-indigo-500 dark:text-indigo-400 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                        >
                                            <MoonIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer Section */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div className="flex justify-between items-center w-full">
                       <button 
                           onClick={() => setShowRecommendations(true)}
                           className="text-xs font-medium text-gray-500 hover:text-purple-600 underline tracking-wide transition-colors"
                       >
                           {t('about')}
                       </button>

                       <ButtonLogout onLogout={() => {
                           onLogout();
                           onClose();
                       }} />
                    </div>
                </div>
            </div>

            {/* Recommendations Modal */}
            <RecommendationsModal 
                isOpen={showRecommendations} 
                onClose={() => setShowRecommendations(false)} 
            />
        </>
    );
};

SideMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    roomId: PropTypes.string,
    username: PropTypes.string,
    soundEnabled: PropTypes.bool.isRequired,
    setSoundEnabled: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    connectedUsers: PropTypes.array,
    theme: PropTypes.string,
    setTheme: PropTypes.func,
};

export default SideMenu;
