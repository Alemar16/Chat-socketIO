import PropTypes from 'prop-types';
import { 
    XMarkIcon, 
    ClipboardDocumentIcon, 
    LinkIcon, 
    UserIcon, 
    SpeakerWaveIcon, 
    SpeakerXMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from "@heroicons/react/24/solid";
import Header from "../Header/Header";
import { ButtonLogout } from "../Buttons/ButtonLogout";
import Swal from 'sweetalert2';
import { useState } from 'react';

const SideMenu = ({ isOpen, onClose, roomId, username, soundEnabled, setSoundEnabled, onLogout, connectedUsers }) => {
    
    const [isUsersListOpen, setIsUsersListOpen] = useState(true);

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
            <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Header Section */}
                <div className="pt-10 pb-4 px-6 border-b border-gray-100">
                    <div className="transform scale-75 origin-center -mb-4">
                        <Header />
                    </div>
                </div>

                {/* Body Section */}
                <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8">
                    
                    {/* Room Details */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Room Details</h4>
                        
                        {/* Room ID */}
                        <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between border border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Room ID</span>
                                <span className="font-mono font-bold text-gray-800">{roomId}</span>
                            </div>
                            <button 
                                onClick={() => copyToClipboard(roomId, "Room ID")}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                                title="Copy ID"
                            >
                                <ClipboardDocumentIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Copy URL Button */}
                        <button
                            onClick={copyRoomUrl}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium border border-purple-100"
                        >
                            <LinkIcon className="w-5 h-5" />
                            Copy Link Invitation
                        </button>
                    </div>

                    {/* Settings Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Settings</h4>
                        
                        {/* Username */}
                        <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Username</span>
                                <span className="font-medium text-gray-800">{username}</span>
                            </div>
                        </div>

                        {/* Sound Toggle */}
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {soundEnabled ? (
                                        <SpeakerWaveIcon className="w-5 h-5" />
                                    ) : (
                                        <SpeakerXMarkIcon className="w-5 h-5" />
                                    )}
                                </div>
                                <span className="font-medium text-gray-700">Notifications</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={soundEnabled}
                                    onChange={(e) => setSoundEnabled(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Connected Users Section */}
                    <div className="space-y-4">
                        <button 
                            onClick={() => setIsUsersListOpen(!isUsersListOpen)}
                            className="w-full flex items-center justify-between text-sm font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                        >
                            <span>Usuarios conectados en esta sala # {connectedUsers.length}</span>
                            {isUsersListOpen ? (
                                <ChevronUpIcon className="w-4 h-4" />
                            ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                            )}
                        </button>
                        
                        {isUsersListOpen && (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                {connectedUsers.map((user, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="relative">
                                            <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                                                <UserIcon className="w-4 h-4" />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <span className={`font-medium text-sm truncate ${user.username === username ? 'text-purple-600' : 'text-gray-700'}`}>
                                            {user.username === username ? `${user.username} (You)` : user.username}
                                        </span>
                                    </div>
                                ))}
                                {connectedUsers.length === 0 && (
                                    <p className="text-sm text-gray-400 italic text-center py-2">No users connected</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer Section */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-center w-full">
                       <ButtonLogout onLogout={() => {
                           onLogout();
                           onClose();
                       }} />
                    </div>
                </div>
            </div>
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
};

export default SideMenu;
